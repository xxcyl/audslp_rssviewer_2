'use client'

import { useState } from 'react'
import { Bookmark, ChevronDown, ChevronUp } from 'lucide-react'
import { useBookmarks } from '@/hooks/useBookmarks'
import { RelatedArticlesPanel } from './RelatedArticlesPanel'
import { cn } from '@/lib/utils'
import type { Article } from '@/lib/types'

interface ArticleDetailClientProps {
  article: Article
}

export function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const { isBookmarked, toggleBookmark, isLoading: bookmarkLoading } = useBookmarks(article.id)
  const [isRelatedOpen, setIsRelatedOpen] = useState(true)
  const hasEmbedding = article.embedding && article.embedding.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleBookmark}
          disabled={bookmarkLoading}
          title={isBookmarked ? '取消收藏' : '收藏文章'}
          className={cn(
            'font-display flex items-center gap-1.5 text-[10px] border-2 px-2 py-1.5 transition-colors',
            isBookmarked
              ? 'text-[var(--brand-accent-dark)] border-[var(--brand-accent-dark)]'
              : 'text-[var(--brand-primary)] border-[var(--brand-primary)] hover:text-[var(--brand-accent-dark)] hover:border-[var(--brand-accent-dark)]'
          )}
        >
          <Bookmark className={cn('w-3.5 h-3.5', isBookmarked && 'fill-current')} />
          {isBookmarked ? '已收藏' : '收藏文章'}
          {article.bookmark_count > 0 && ` (${article.bookmark_count})`}
        </button>

        {hasEmbedding && (
          <button
            onClick={() => setIsRelatedOpen((v) => !v)}
            className="font-display flex items-center gap-1.5 text-[10px] text-[var(--brand-primary)] hover:text-[var(--brand-accent-dark)] transition-colors"
          >
            相關文章
            {isRelatedOpen ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
          </button>
        )}
      </div>

      {isRelatedOpen && hasEmbedding && (
        <RelatedArticlesPanel articleId={article.id} onClose={() => setIsRelatedOpen(false)} />
      )}
    </div>
  )
}
