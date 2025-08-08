'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { LikeStatus } from '@/lib/types'

// 生成瀏覽器指紋
function generateFingerprint(): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Browser fingerprint', 2, 2)
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    canvas.toDataURL()
  ].join('|')

  // 簡單的雜湊函數
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 轉換為 32 位整數
  }
  
  return Math.abs(hash).toString(36)
}

// 按讚 API 函數
async function toggleLike(articleId: number, userFingerprint: string): Promise<LikeStatus> {
  try {
    // 檢查是否已按讚
    const { data: existingLike, error: checkError } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_fingerprint', userFingerprint)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    let newLikeStatus: boolean
    
    if (existingLike) {
      // 取消按讚
      const { error: deleteError } = await supabase
        .from('article_likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) throw deleteError

      // 減少按讚數
      const { error: decrementError } = await supabase.rpc('decrement_likes', {
        article_id: articleId
      })

      if (decrementError) throw decrementError
      
      newLikeStatus = false
    } else {
      // 新增按讚
      const { error: insertError } = await supabase
        .from('article_likes')
        .insert({
          article_id: articleId,
          user_fingerprint: userFingerprint,
          ip_address: null, // 在客戶端無法獲取真實 IP
          user_agent: navigator.userAgent
        })

      if (insertError) throw insertError

      // 增加按讚數
      const { error: incrementError } = await supabase.rpc('increment_likes', {
        article_id: articleId
      })

      if (incrementError) throw incrementError
      
      newLikeStatus = true
    }

    // 獲取最新的按讚總數
    const { data: article, error: articleError } = await supabase
      .from('rss_entries')
      .select('likes_count')
      .eq('id', articleId)
      .single()

    if (articleError) throw articleError

    return {
      isLiked: newLikeStatus,
      totalLikes: article.likes_count || 0
    }

  } catch (error) {
    console.error('toggleLike error:', error)
    throw error
  }
}

// 獲取按讚狀態
async function getLikeStatus(articleId: number, userFingerprint: string): Promise<LikeStatus> {
  try {
    // 檢查用戶是否已按讚
    const { data: likeData, error: likeError } = await supabase
      .from('article_likes')
      .select('id')
      .eq('article_id', articleId)
      .eq('user_fingerprint', userFingerprint)
      .single()

    if (likeError && likeError.code !== 'PGRST116') {
      throw likeError
    }

    // 獲取總按讚數
    const { data: article, error: articleError } = await supabase
      .from('rss_entries')
      .select('likes_count')
      .eq('id', articleId)
      .single()

    if (articleError) throw articleError

    return {
      isLiked: !!likeData,
      totalLikes: article.likes_count || 0
    }
  } catch (error) {
    console.error('getLikeStatus error:', error)
    throw error
  }
}

// 按讚功能的主要 hook
export function useLikes(articleId: number) {
  const [userFingerprint, setUserFingerprint] = useState<string>('')
  const queryClient = useQueryClient()

  // 生成用戶指紋
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserFingerprint(generateFingerprint())
    }
  }, [])

  // 獲取按讚狀態
  const likeStatusQuery = useQuery({
    queryKey: ['like-status', articleId, userFingerprint],
    queryFn: () => getLikeStatus(articleId, userFingerprint),
    enabled: !!userFingerprint && !!articleId,
    staleTime: 30 * 1000, // 30 秒內資料視為新鮮
  })

  // 按讚切換 mutation
  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleLike(articleId, userFingerprint),
    onSuccess: (data) => {
      // 更新快取
      queryClient.setQueryData(['like-status', articleId, userFingerprint], data)
      
      // 使相關查詢失效，觸發重新獲取
      queryClient.invalidateQueries({ 
        queryKey: ['articles'],
        exact: false 
      })
    },
    onError: (error) => {
      console.error('按讚操作失敗:', error)
      // 可以在這裡添加錯誤提示
    }
  })

  return {
    isLiked: likeStatusQuery.data?.isLiked ?? false,
    totalLikes: likeStatusQuery.data?.totalLikes ?? 0,
    toggleLike: toggleLikeMutation.mutate,
    isLoading: likeStatusQuery.isLoading || toggleLikeMutation.isPending,
    error: likeStatusQuery.error || toggleLikeMutation.error,
  }
}

// 獲取多篇文章的按讚狀態
export function useBatchLikes(articleIds: number[]) {
  const [userFingerprint, setUserFingerprint] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserFingerprint(generateFingerprint())
    }
  }, [])

  return useQuery({
    queryKey: ['batch-like-status', articleIds, userFingerprint],
    queryFn: async () => {
      if (!userFingerprint || articleIds.length === 0) {
        return new Set<number>()
      }

      try {
        const { data, error } = await supabase
          .from('article_likes')
          .select('article_id')
          .eq('user_fingerprint', userFingerprint)
          .in('article_id', articleIds)

        if (error) throw error

        return new Set(data?.map(item => item.article_id) || [])
      } catch (error) {
        console.error('批量獲取按讚狀態失敗:', error)
        return new Set<number>()
      }
    },
    enabled: !!userFingerprint && articleIds.length > 0,
    staleTime: 60 * 1000, // 1 分鐘內資料視為新鮮
  })
}

// 獲取用戶指紋的 hook（可單獨使用）
export function useUserFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFingerprint(generateFingerprint())
    }
  }, [])

  return fingerprint
}