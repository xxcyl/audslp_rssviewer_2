'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Dices, ExternalLink, FileText, Heart, Shuffle, Unlock, FlaskConical } from 'lucide-react'
import { useRandomArticle } from '@/hooks/useArticles'
import { useLikes } from '@/hooks/useLikes'
import { RelatedArticlesPanel } from './RelatedArticlesPanel'
import { getPrimaryEvidenceType, getEvidenceLabel, evidenceBadgeStyle } from '@/lib/publicationTypes'
import { cn } from '@/lib/utils'

interface RandomPickProps {
  className?: string
}

export function RandomPick({ className }: RandomPickProps) {
  const { data: article, isLoading, reroll } = useRandomArticle()
  const articleId = article?.id ?? 0
  const { isLiked, totalLikes, toggleLike, isLoading: likeLoading } = useLikes(articleId)
  const [isRelatedOpen, setIsRelatedOpen] = useState(false)

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
  const evidenceType = getPrimaryEvidenceType(article.publication_types)

  return (
    <div className={className}>
    <div
      className="bg-[var(--brand-featured-bg)] border-4 border-[var(--brand-primary)] outline outline-3 outline-[var(--brand-bg)] -outline-offset-[9px] px-5 md:px-8 py-6"
      style={{
        backgroundImage: 'radial-gradient(rgba(17,17,16,0.05) 1.5px, transparent 1.5px)',
        backgroundSize: '7px 7px',
        boxShadow: '8px 8px 0 var(--brand-accent)'
      }}
    >
      {/* 標籤 + 換一篇 */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Dices className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
          <span className="font-display text-[9px] tracking-normal uppercase text-[var(--brand-primary)]">
            Random Pick
          </span>
        </div>
        <button
          onClick={() => reroll()}
          className="font-display flex items-center gap-1.5 text-[9px] text-[var(--brand-primary)] bg-[var(--brand-accent)] px-2.5 py-1.5 transition-colors hover:brightness-95"
          style={{ boxShadow: '3px 3px 0 var(--brand-primary)' }}
        >
          <Shuffle className="w-3 h-3" />
          Reroll
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* 期刊來源 + 日期 */}
        <div className="flex flex-col md:w-[190px] flex-shrink-0 gap-2 md:gap-1.5">
          <span className="font-display inline-block w-fit text-[8px] leading-relaxed tracking-wide uppercase bg-[var(--brand-accent)] text-[var(--brand-primary)] px-1.5 py-1">
            {article.source || 'Unknown Source'}
          </span>
          <span className="text-base text-[var(--brand-text-faint)]">
            {formatDate(article.published)}
          </span>
          {(evidenceType || article.pmc_id) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {evidenceType && (
                <span
                  className="font-display inline-flex items-center gap-1 w-fit text-[8px] leading-relaxed tracking-wide uppercase border-[1.5px] px-1.5 py-1"
                  style={evidenceBadgeStyle(evidenceType)}
                >
                  <FlaskConical className="w-2.5 h-2.5" />
                  {getEvidenceLabel(evidenceType)}
                </span>
              )}
              {article.pmc_id && (
                <a
                  href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${article.pmc_id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display inline-flex items-center gap-1 w-fit text-[8px] leading-relaxed tracking-wide uppercase border-[1.5px] border-[var(--brand-accent-dark)] text-[var(--brand-accent-dark)] px-1.5 py-1 hover:bg-[var(--brand-accent-dark)] hover:text-white transition-colors"
                >
                  <Unlock className="w-2.5 h-2.5" />
                  Free Full Text
                </a>
              )}
            </div>
          )}
        </div>

        {/* 標題與摘要 */}
        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
          <h3 className="text-3xl leading-snug font-semibold text-[var(--brand-primary)]">
            {article.title_translated || article.title || '無標題'}
          </h3>

          {article.title && article.title_translated && (
            <p className="text-base text-[var(--brand-text-muted)]">
              {'// '}{article.title}
            </p>
          )}

          {article.tldr && (
            <p className="text-lg leading-relaxed text-[var(--brand-text)] mt-1">
              {article.tldr}
            </p>
          )}

          {article.english_tldr && (
            <p className="text-base leading-relaxed text-[var(--brand-text-muted)]">
              {'// '}{article.english_tldr}
            </p>
          )}
        </div>

        {/* 按讚與外部連結 */}
        <div className="flex flex-row md:flex-col md:w-[140px] flex-shrink-0 items-center md:items-end justify-between gap-3">
          <button
            onClick={() => toggleLike()}
            disabled={likeLoading}
            className={cn(
              "font-display flex items-center gap-1.5 text-[10px] border-2 px-1.5 py-1 transition-colors",
              isLiked ? "text-red-500 border-red-500" : "text-[var(--brand-primary)] border-[var(--brand-primary)] hover:text-red-500 hover:border-red-500"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-current")} />
            {totalLikes || 0}
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
    </div>
    {isRelatedOpen && (
      <div className="mt-1">
        <RelatedArticlesPanel articleId={article.id} onClose={() => setIsRelatedOpen(false)} />
      </div>
    )}
    </div>
  )
}
