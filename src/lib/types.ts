// 學術文獻資料庫的 TypeScript 類型定義

export interface Article {
  id: number // JavaScript 中 bigint 處理為 number
  title: string // 資料庫中是 text，不能為 null
  title_translated: string | null // 可為 null
  tldr: string | null // 可為 null
  english_tldr: string | null // 可為 null
  source: string // 資料庫中是 varchar(255)，不能為 null
  link: string // 資料庫中是 text，不能為 null
  published: string | null // timestamp with time zone，可為 null
  created_at: string | null // timestamp with time zone，可為 null
  pmid: string | null // varchar(50)，可為 null
  doi: string | null // varchar(255)，可為 null
  embedding: number[] | null // VECTOR 類型，可為 null
  publication_types: string[] | null // text[] 類型，PubMed 官方研究類型分類，可為 null
  pmc_id: string | null // PubMed Central ID，有值代表 PMC 提供免費全文，可為 null
  mesh_terms: string[] | null // text[] 類型，PubMed MeSH 主要主題標籤，可為 null
  bookmark_count: number // 被收藏的總次數（由 DB trigger 同步，不記錄是誰收藏），保證不為 null
}

// 個人收藏（需登入），取代原本的匿名按讚
export interface Bookmark {
  user_id: string
  article_id: number
  created_at: string
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
  publicationType?: string
  sortBy: 'published.desc' | 'published.asc' | 'created_at.desc' | 'bookmark_count.desc' | 'relevance.desc'
  searchQuery?: string
  todayOnly?: boolean // 只顯示今日新增收錄的文章（搜尋模式下忽略此篩選）
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
  publicationType?: string
  sortBy: string
  searchQuery?: string
  todayOnly?: boolean
}

// 統計資訊
export interface StatsInfo {
  totalArticles: number
  totalSources: number
  recentArticles: number
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
  showBookmarkButton?: boolean
  showRecommendations?: boolean
  onBookmark?: (articleId: number) => void
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