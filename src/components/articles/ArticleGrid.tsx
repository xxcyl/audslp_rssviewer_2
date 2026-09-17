'use client'

import { Inbox } from 'lucide-react'
import { ArticleCard } from './ArticleCard'
import type { Article } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ArticleGridProps {
  articles: Article[]
  onLike?: (articleId: number) => void
  isLoading?: boolean
  searchTerm?: string // 新增：搜尋詞用於高亮
  onMeshTermClick?: (term: string) => void
  className?: string
}

// 載入中的骨架屏組件
function ArticleRowSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 py-6 border-t border-[var(--brand-primary)]/[0.14] animate-pulse">
      <div className="md:w-[190px] flex-shrink-0 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="md:w-[140px] flex-shrink-0 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}

// 空狀態組件
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border-t border-[var(--brand-primary)]/[0.14]">
      <Inbox className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-[var(--brand-primary)] mb-2">
        目前沒有文章
      </h3>
      <p className="text-[var(--brand-text-muted)] max-w-md">
        資料庫中暫無文章資料，或當前篩選條件沒有匹配的結果。請嘗試調整篩選條件或稍後再試。
      </p>
    </div>
  )
}

export function ArticleGrid({
  articles,
  onLike,
  isLoading = false,
  searchTerm,
  onMeshTermClick,
  className
}: ArticleGridProps) {

  if (isLoading) {
    return (
      <div className={cn("flex flex-col", className)}>
        {/* 顯示 5 個載入中的骨架屏 */}
        {Array.from({ length: 5 }, (_, i) => (
          <ArticleRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className={className}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onLike={onLike}
          searchTerm={searchTerm} // 傳遞搜尋詞給 ArticleCard
          onMeshTermClick={onMeshTermClick}
        />
      ))}
    </div>
  )
}
