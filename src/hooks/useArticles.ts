'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Article, RecommendedArticle, FilterOptions, SupabaseQueryParams } from '@/lib/types'

interface UseArticlesOptions {
  page: number
  pageSize: number
  filters: FilterOptions
}

interface ArticlesResponse {
  articles: Article[]
  totalCount: number
  sources: string[]
}

// 獲取文章資料的 API 函數
async function fetchArticles({ 
  page, 
  pageSize, 
  source, 
  sortBy 
}: SupabaseQueryParams): Promise<ArticlesResponse> {
  try {
    // 建構查詢
    let query = supabase.from('rss_entries').select('*', { count: 'exact' })
    
    // 應用篩選條件
    if (source) {
      query = query.eq('source', source)
    }

    // 應用排序
    const [sortField, sortOrder] = sortBy.split('.')
    if (sortOrder === 'desc') {
      query = query.order(sortField, { ascending: false })
    } else {
      query = query.order(sortField, { ascending: true })
    }

    // 應用分頁
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: articles, error, count } = await query

    if (error) {
      throw new Error(`資料載入失敗: ${error.message}`)
    }

    // 同時獲取所有來源
    const { data: sourcesData, error: sourcesError } = await supabase
      .from('rss_entries')
      .select('source')
      .not('source', 'is', null)

    if (sourcesError) {
      console.warn('載入來源列表失敗:', sourcesError)
    }

    const sources = sourcesData 
      ? [...new Set(sourcesData.map(item => item.source).filter(Boolean))].sort()
      : []

    return {
      articles: articles || [],
      totalCount: count || 0,
      sources
    }

  } catch (error) {
    console.error('fetchArticles error:', error)
    throw error
  }
}

// 獲取相似文章的函數
async function fetchSimilarArticles(
  articleId: number,
  threshold: number = 0.6,
  limit: number = 5
): Promise<RecommendedArticle[]> {
  try {
    const { data, error } = await supabase.rpc('get_similar_articles', {
      target_article_id: articleId,
      similarity_threshold: threshold,
      limit_count: limit
    })

    if (error) {
      throw new Error(`相似文章載入失敗: ${error.message}`)
    }

    return (data || []) as RecommendedArticle[]
  } catch (error) {
    console.error('fetchSimilarArticles error:', error)
    throw error
  }
}

// 主要的文章 hook
export function useArticles({ page, pageSize, filters }: UseArticlesOptions) {
  return useQuery({
    queryKey: ['articles', page, pageSize, filters],
    queryFn: () => fetchArticles({
      page,
      pageSize,
      source: filters.source,
      sortBy: filters.sortBy,
      searchQuery: filters.searchQuery,
    }),
    staleTime: 5 * 60 * 1000, // 5 分鐘內資料視為新鮮
    gcTime: 10 * 60 * 1000, // 10 分鐘後清除快取
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// 相似文章推薦 hook
export function useSimilarArticles(
  articleId: number | null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['similar-articles', articleId],
    queryFn: () => fetchSimilarArticles(articleId!),
    enabled: enabled && !!articleId,
    staleTime: 10 * 60 * 1000, // 10 分鐘內資料視為新鮮
    gcTime: 30 * 60 * 1000, // 30 分鐘後清除快取
  })
}

// 單篇文章詳情 hook
export function useArticle(articleId: number | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      if (!articleId) return null
      
      const { data, error } = await supabase
        .from('rss_entries')
        .select('*')
        .eq('id', articleId)
        .single()

      if (error) {
        throw new Error(`文章載入失敗: ${error.message}`)
      }

      return data as Article
    },
    enabled: enabled && !!articleId,
    staleTime: 10 * 60 * 1000,
  })
}

// 統計資訊 hook
export function useArticleStats() {
  return useQuery({
    queryKey: ['article-stats'],
    queryFn: async () => {
      try {
        // 總文章數
        const { count: totalArticles, error: countError } = await supabase
          .from('rss_entries')
          .select('*', { count: 'exact', head: true })

        if (countError) throw countError

        // 來源數量
        const { data: sourcesData, error: sourcesError } = await supabase
          .from('rss_entries')
          .select('source')
          .not('source', 'is', null)

        if (sourcesError) throw sourcesError

        const totalSources = new Set(
          sourcesData?.map(item => item.source).filter(Boolean)
        ).size

        // 最近 7 天的文章數
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        
        const { count: recentArticles, error: recentError } = await supabase
          .from('rss_entries')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString())

        if (recentError) throw recentError

        // 熱門文章數（按讚數 > 0）
        const { count: popularArticles, error: popularError } = await supabase
          .from('rss_entries')
          .select('*', { count: 'exact', head: true })
          .gt('likes_count', 0)

        if (popularError) throw popularError

        return {
          totalArticles: totalArticles || 0,
          totalSources,
          recentArticles: recentArticles || 0,
          popularArticles: popularArticles || 0,
        }
      } catch (error) {
        console.error('統計資訊載入失敗:', error)
        throw error
      }
    },
    staleTime: 15 * 60 * 1000, // 15 分鐘內資料視為新鮮
    gcTime: 30 * 60 * 1000, // 30 分鐘後清除快取
  })
}