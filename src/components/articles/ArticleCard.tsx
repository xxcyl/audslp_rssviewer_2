'use client'

import { useState, useEffect } from 'react'
import { Heart, ExternalLink, FileText, Calendar, Search } from 'lucide-react'
import { useLikes } from '@/hooks/useLikes'
import { SearchHighlight } from './SearchBar'
import type { Article } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  onLike?: (articleId: number) => void
  onRecommend?: (articleId: number) => void
  searchTerm?: string // 新增：搜尋詞用於高亮
  className?: string
}

export function ArticleCard({
  article,
  onLike,
  onRecommend,
  searchTerm, // 新增參數
  className
}: ArticleCardProps) {
  // 使用按讚 hook
  const {
    isLiked,
    totalLikes,
    toggleLike,
    isLoading: likeLoading
  } = useLikes(article.id)

  // 本地狀態
  const [localLiked, setLocalLiked] = useState(isLiked)
  const [localLikeCount, setLocalLikeCount] = useState(totalLikes)

  // 同步遠端狀態
  useEffect(() => {
    setLocalLiked(isLiked)
    setLocalLikeCount(totalLikes)
  }, [isLiked, totalLikes])

  const handleLike = async () => {
    try {
      // 樂觀更新 UI
      setLocalLiked(!localLiked)
      setLocalLikeCount(prev => localLiked ? prev - 1 : prev + 1)

      // 呼叫 hook 中的按讚函數
      toggleLike()

      // 通知父組件
      onLike?.(article.id)
    } catch (error) {
      // 如果失敗，恢復狀態
      setLocalLiked(isLiked)
      setLocalLikeCount(totalLikes)
      console.error('按讚失敗:', error)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未知日期'
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const hasEmbedding = article.embedding && article.embedding.length > 0

  return (
    <div className={cn(
      "flex flex-col md:flex-row gap-4 md:gap-8 py-6 border-t border-[var(--brand-primary)]/[0.14]",
      className
    )}>
      {/* 期刊來源 + 發布日期 */}
      <div className="flex flex-col md:w-[190px] flex-shrink-0 gap-1 md:gap-1.5">
        <span className="text-[10.5px] font-bold tracking-wide uppercase text-[var(--brand-accent)]">
          {article.source || 'Unknown Source'}
        </span>
        <span className="flex items-center gap-1 text-xs text-[var(--brand-text-faint)]">
          <Calendar className="w-3 h-3" />
          {formatDate(article.published)}
        </span>
      </div>

      {/* 標題與摘要 */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <h3 className="font-headline font-semibold text-lg leading-snug text-[var(--brand-primary)]">
          <SearchHighlight
            text={article.title_translated || article.title || '無標題'}
            searchTerm={searchTerm || ''}
          />
        </h3>

        {article.title && article.title_translated && (
          <p className="font-headline italic text-[13px] leading-relaxed text-[var(--brand-text-muted)]">
            <SearchHighlight
              text={article.title}
              searchTerm={searchTerm || ''}
            />
          </p>
        )}

        {article.tldr && (
          <p className="text-sm leading-relaxed text-[var(--brand-text)] mt-1">
            {article.tldr.includes('|') ? (
              article.tldr.split('|').map((sentence, index, array) => (
                <span key={index}>
                  <SearchHighlight
                    text={sentence.trim()}
                    searchTerm={searchTerm || ''}
                  />
                  {index < array.length - 1 && (
                    <span className="text-[var(--brand-text-faint)] mx-1.5">·</span>
                  )}
                </span>
              ))
            ) : (
              <SearchHighlight
                text={article.tldr}
                searchTerm={searchTerm || ''}
              />
            )}
          </p>
        )}

        {article.english_tldr && (
          <p className="text-[13px] leading-relaxed italic text-[var(--brand-text-muted)] line-clamp-2">
            <SearchHighlight
              text={article.english_tldr}
              searchTerm={searchTerm || ''}
            />
          </p>
        )}
      </div>

      {/* 按讚與外部連結 */}
      <div className="flex flex-row md:flex-col md:w-[140px] flex-shrink-0 items-center md:items-end justify-between gap-3">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            localLiked ? "text-red-500" : "text-[var(--brand-text-faint)] hover:text-red-500"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", localLiked && "fill-current")} />
          {localLikeCount || 0}
        </button>

        <div className="flex flex-row md:flex-col items-end gap-3 md:gap-1.5 text-xs text-[var(--brand-primary)]">
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[var(--brand-accent-dark)] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              PubMed
            </a>
          )}

          {article.doi && (
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[var(--brand-accent-dark)] transition-colors"
            >
              <FileText className="w-3 h-3" />
              DOI
            </a>
          )}

          {hasEmbedding && (
            <button
              onClick={() => onRecommend?.(article.id)}
              className="flex items-center gap-1 hover:text-[var(--brand-accent-dark)] transition-colors"
            >
              <Search className="w-3 h-3" />
              相關文獻
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
