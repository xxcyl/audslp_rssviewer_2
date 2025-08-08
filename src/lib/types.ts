// 學術文獻資料庫的 TypeScript 類型定義

export interface Article {
  id: number
  title: string | null
  title_translated: string | null
  tldr: string | null
  english_tldr: string | null
  source: string | null
  link: string | null
  published: string | null
  created_at: string
  pmid: string | null
  doi: string | null
  embedding: number[] | null
  likes_count: number
}

export interface ArticleLike {
  id: string
  article_id: number
  user_fingerprint: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface LikeStatus {
  isLiked: boolean
  totalLikes: number
}

export interface RecommendedArticle extends Article {
  similarity: number
}

// 分頁相關類型
export interface PaginationState {
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// 篩選相關類型
export interface FilterOptions {
  source?: string
  sortBy: 'published.desc' | 'published.asc' | 'created_at.desc' | 'title' | 'likes_count.desc'
  searchQuery?: string
}

// API 回應類型
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

// Supabase 查詢參數
export interface SupabaseQueryParams {
  page: number
  pageSize: number
  source?: string
  sortBy: string
  searchQuery?: string
}

// 統計資訊
export interface StatsInfo {
  totalArticles: number
  totalSources: number
  recentArticles: number
  popularArticles: number
}

// 錯誤處理
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// 載入狀態
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// 組件通用 Props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// 文章卡片組件 Props
export interface ArticleCardProps extends BaseComponentProps {
  article: Article
  showLikeButton?: boolean
  showRecommendations?: boolean
  onLike?: (articleId: number) => void
  onRecommend?: (articleId: number) => void
}

// 分頁組件 Props  
export interface PaginationProps extends BaseComponentProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showInfo?: boolean
}

// 篩選工具列組件 Props
export interface FilterToolbarProps extends BaseComponentProps {
  sources: string[]
  currentFilters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  totalCount: number
}