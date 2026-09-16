'use client'

import { Inbox } from 'lucide-react'
import { ArticleCard } from './ArticleCard'
import type { Article } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ArticleGridProps {
  articles: Article[]
  onLike?: (articleId: number) => void
  onRecommend?: (articleId: number) => void
  isLoading?: boolean
  searchTerm?: string // 新增：搜尋詞用於高亮
  className?: string
}

// 載入中的骨架屏組件
function ArticleCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="h-6 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  )
}

// 空狀態組件
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        目前沒有文章
      </h3>
      <p className="text-gray-500 max-w-md">
        資料庫中暫無文章資料，或當前篩選條件沒有匹配的結果。請嘗試調整篩選條件或稍後再試。
      </p>
    </div>
  )
}

export function ArticleGrid({ 
  articles, 
  onLike, 
  onRecommend, 
  isLoading = false,
  searchTerm,
  className 
}: ArticleGridProps) {
  
  if (isLoading) {
    return (
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}>
        {/* 顯示 6 個載入中的骨架屏 */}
        {Array.from({ length: 6 }, (_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className={cn("min-h-[400px]", className)}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className={cn(
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    className
    )}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onLike={onLike}
          onRecommend={onRecommend}
          searchTerm={searchTerm} // 傳遞搜尋詞給 ArticleCard
          className="h-full"
        />
      ))}
    </div>
  )
}
