'use client'

import { Dices, ExternalLink, FileText, Heart, Search, Shuffle } from 'lucide-react'
import { useRandomArticle } from '@/hooks/useArticles'
import { useLikes } from '@/hooks/useLikes'
import { cn } from '@/lib/utils'

interface RandomPickProps {
  onRecommend?: (articleId: number) => void
  className?: string
}

export function RandomPick({ onRecommend, className }: RandomPickProps) {
  const { data: article, isLoading, reroll } = useRandomArticle()
  const articleId = article?.id ?? 0
  const { isLiked, totalLikes, toggleLike, isLoading: likeLoading } = useLikes(articleId)

  if (isLoading || !article) return null

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
    <div className={cn("bg-[var(--brand-featured-bg)] border-t-2 border-[var(--brand-accent)] px-5 md:px-8 py-6", className)}>
      {/* 標籤 + 換一篇 */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Dices className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--brand-accent)]">
            隨機精選 · Random Pick
          </span>
        </div>
        <button
          onClick={() => reroll()}
          className="flex items-center gap-1.5 text-xs text-[var(--brand-text-muted)] hover:text-[var(--brand-accent-dark)] transition-colors"
        >
          <Shuffle className="w-3 h-3" />
          換一篇
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* 期刊來源 + 日期 */}
        <div className="flex flex-col md:w-[190px] flex-shrink-0 gap-1 md:gap-1.5">
          <span className="text-[10.5px] font-bold tracking-wide uppercase text-[var(--brand-accent)]">
            {article.source || 'Unknown Source'}
          </span>
          <span className="text-xs text-[var(--brand-text-faint)]">
            {formatDate(article.published)}
          </span>
        </div>

        {/* 標題與摘要 */}
        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
          <h3 className="font-headline font-semibold text-xl leading-snug text-[var(--brand-primary)]">
            {article.title_translated || article.title || '無標題'}
          </h3>

          {article.title && article.title_translated && (
            <p className="font-headline italic text-sm text-[var(--brand-text-muted)]">
              {article.title}
            </p>
          )}

          {article.tldr && (
            <p className="text-sm leading-relaxed text-[var(--brand-text)] mt-1">
              {article.tldr}
            </p>
          )}

          {article.english_tldr && (
            <p className="text-[13px] leading-relaxed italic text-[var(--brand-text-muted)] line-clamp-3">
              {article.english_tldr}
            </p>
          )}
        </div>

        {/* 按讚與外部連結 */}
        <div className="flex flex-row md:flex-col md:w-[140px] flex-shrink-0 items-center md:items-end justify-between gap-3">
          <button
            onClick={() => toggleLike()}
            disabled={likeLoading}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              isLiked ? "text-red-500" : "text-[var(--brand-text-muted)] hover:text-red-500"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-current")} />
            {totalLikes || 0}
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
    </div>
  )
}
