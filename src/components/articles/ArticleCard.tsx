'use client'

import { useState, useEffect } from 'react'
import { Heart, ExternalLink, FileText, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { useLikes } from '@/hooks/useLikes'
import { SearchHighlight } from './SearchBar'
import { RelatedArticlesPanel } from './RelatedArticlesPanel'
import type { Article } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  onLike?: (articleId: number) => void
  searchTerm?: string // 新增：搜尋詞用於高亮
  className?: string
}

export function ArticleCard({
  article,
  onLike,
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
  const [isRelatedOpen, setIsRelatedOpen] = useState(false)

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
    <div>
      <div className={cn(
        "flex flex-col md:flex-row gap-4 md:gap-8 py-6 border-t border-[var(--brand-primary)]/[0.14]",
        className
      )}>
        {/* 期刊來源 + 發布日期 */}
        <div className="flex flex-col md:w-[190px] flex-shrink-0 gap-2 md:gap-1.5">
          <span className="font-display inline-block w-fit text-[8px] leading-relaxed tracking-wide uppercase bg-[var(--brand-accent)] text-[var(--brand-primary)] px-1.5 py-1">
            {article.source || 'Unknown Source'}
          </span>
          <span className="flex items-center gap-1 text-base text-[var(--brand-text-faint)]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(article.published)}
          </span>
        </div>

        {/* 標題與摘要 */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3 className="text-2xl leading-snug text-[var(--brand-primary)]">
            <SearchHighlight
              text={article.title_translated || article.title || '無標題'}
              searchTerm={searchTerm || ''}
            />
          </h3>

          {article.title && article.title_translated && (
            <p className="text-base leading-relaxed text-[var(--brand-text-muted)]">
              {'// '}
              <SearchHighlight
                text={article.title}
                searchTerm={searchTerm || ''}
              />
            </p>
          )}

          {article.tldr && (
            <p className="text-lg leading-relaxed text-[var(--brand-text)] mt-1">
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
            <p className="text-base leading-relaxed text-[var(--brand-text-muted)]">
              {'// '}
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
              "font-display flex items-center gap-1.5 text-[10px] border-2 px-1.5 py-1 transition-colors",
              localLiked ? "text-red-500 border-red-500" : "text-[var(--brand-primary)] border-[var(--brand-primary)] hover:text-red-500 hover:border-red-500"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", localLiked && "fill-current")} />
            {localLikeCount || 0}
          </button>

          <div className="flex flex-row md:flex-col items-end gap-3 md:gap-1.5 text-base text-[var(--brand-primary)]">
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
                onClick={() => setIsRelatedOpen(v => !v)}
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  isRelatedOpen
                    ? "bg-[var(--brand-primary)] text-[var(--brand-accent)] px-1.5 py-0.5"
                    : "hover:text-[var(--brand-accent-dark)]"
                )}
              >
                Related
                {isRelatedOpen ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
      {isRelatedOpen && (
        <RelatedArticlesPanel articleId={article.id} onClose={() => setIsRelatedOpen(false)} />
      )}
    </div>
  )
}
