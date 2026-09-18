'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bookmark, ExternalLink, FileText, Calendar, ChevronDown, ChevronUp, Unlock, FlaskConical } from 'lucide-react'
import { useBookmarks } from '@/hooks/useBookmarks'
import { SearchHighlight } from './SearchBar'
import { RelatedArticlesPanel } from './RelatedArticlesPanel'
import { getPrimaryEvidenceType, getEvidenceLabel, evidenceBadgeStyle } from '@/lib/publicationTypes'
import type { Article } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  searchTerm?: string // 新增：搜尋詞用於高亮
  onMeshTermClick?: (term: string) => void
  className?: string
}

export function ArticleCard({
  article,
  searchTerm, // 新增參數
  onMeshTermClick,
  className
}: ArticleCardProps) {
  const { isBookmarked, toggleBookmark, isLoading: bookmarkLoading } = useBookmarks(article.id)
  const [isRelatedOpen, setIsRelatedOpen] = useState(false)

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
                  className="font-display inline-flex items-center gap-1 w-fit text-[8px] leading-relaxed tracking-wide uppercase border-[1.5px] border-blue-600 text-blue-600 px-1.5 py-1 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Unlock className="w-2.5 h-2.5" />
                  Free Full Text
                </a>
              )}
            </div>
          )}
        </div>

        {/* 標題與摘要 */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3 className="text-2xl leading-snug font-semibold text-[var(--brand-primary)]">
            <Link href={`/article/${article.id}`} className="hover:text-[var(--brand-accent-dark)] transition-colors">
              <SearchHighlight
                text={article.title_translated || article.title || '無標題'}
                searchTerm={searchTerm || ''}
              />
            </Link>
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

          {article.mesh_terms && article.mesh_terms.length > 0 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {article.mesh_terms.slice(0, 4).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onMeshTermClick?.(term)}
                  className="text-sm text-[var(--brand-text-faint)] hover:text-[var(--brand-accent-dark)] hover:underline transition-colors"
                >
                  #{term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 收藏與外部連結 */}
        <div className="flex flex-row md:flex-col md:w-[140px] flex-shrink-0 items-center md:items-end justify-between gap-3">
          <button
            onClick={toggleBookmark}
            disabled={bookmarkLoading}
            title={isBookmarked ? '取消收藏' : '收藏文章'}
            className={cn(
              "font-display flex items-center gap-1.5 text-[10px] border-2 px-1.5 py-1 transition-colors",
              isBookmarked ? "text-[var(--brand-accent-dark)] border-[var(--brand-accent-dark)]" : "text-[var(--brand-primary)] border-[var(--brand-primary)] hover:text-[var(--brand-accent-dark)] hover:border-[var(--brand-accent-dark)]"
            )}
          >
            <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && "fill-current")} />
            {article.bookmark_count > 0 && article.bookmark_count}
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
