'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Article } from '@/lib/types'
import { useAuth } from './useAuth'

async function getBookmarkStatus(articleId: number, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('article_id')
    .eq('article_id', articleId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return !!data
}

async function toggleBookmark(articleId: number, userId: string, isBookmarked: boolean): Promise<boolean> {
  if (isBookmarked) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('article_id', articleId)
      .eq('user_id', userId)

    if (error) throw error
    return false
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert({ article_id: articleId, user_id: userId })

  if (error) throw error
  return true
}

// 收藏功能的主要 hook：未登入時點擊會觸發登入視窗，不做匿名收藏
export function useBookmarks(articleId: number) {
  const { user, openLogin } = useAuth()
  const queryClient = useQueryClient()

  const statusQuery = useQuery({
    queryKey: ['bookmark-status', articleId, user?.id],
    queryFn: () => getBookmarkStatus(articleId, user!.id),
    enabled: !!user && !!articleId,
    staleTime: 30 * 1000,
  })

  const toggleMutation = useMutation({
    mutationFn: () => toggleBookmark(articleId, user!.id, !!statusQuery.data),
    onSuccess: (newStatus) => {
      queryClient.setQueryData(['bookmark-status', articleId, user?.id], newStatus)
      queryClient.invalidateQueries({ queryKey: ['my-bookmarks'], exact: false })
    },
    onError: (error) => {
      console.error('收藏操作失敗:', error)
    },
  })

  const toggleBookmarkOrPromptLogin = () => {
    if (!user) {
      openLogin()
      return
    }
    toggleMutation.mutate()
  }

  return {
    isBookmarked: statusQuery.data ?? false,
    toggleBookmark: toggleBookmarkOrPromptLogin,
    isLoading: statusQuery.isLoading || toggleMutation.isPending,
    error: statusQuery.error || toggleMutation.error,
  }
}

// 「我的收藏」頁面用：取得目前登入使用者收藏的所有文章
export function useMyBookmarks() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['my-bookmarks', user?.id],
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('created_at, article:rss_entries(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data ?? [])
        .map((row) => row.article as unknown as Article | null)
        .filter((article): article is Article => article !== null)
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  })
}
