'use client'

import { ChevronUp, ExternalLink } from 'lucide-react'
import { useSimilarArticles } from '@/hooks/useArticles'
import type { RecommendedArticle } from '@/lib/types'

interface RelatedArticlesPanelProps {
  articleId: number
  onClose: () => void
}

function similarityBadgeStyle(similarity: number) {
  const percentage = similarity * 100
  if (percentage >= 80) return { background: 'var(--brand-primary)', color: 'var(--brand-accent)' }
  if (percentage >= 60) return { background: 'var(--brand-accent)', color: 'var(--brand-primary)' }
  return { background: '#D6D6D2', color: 'var(--brand-primary)' }
}

function RelatedArticleRow({ article }: { article: RecommendedArticle }) {
  const percentage = Math.round(article.similarity * 100)

  return (
    <div className="flex gap-3.5 items-start py-3 border-t border-[var(--brand-primary)]/[0.14]">
      <span
        className="font-display shrink-0 mt-0.5 text-[8px] px-1.5 py-1"
        style={similarityBadgeStyle(article.similarity)}
      >
        {percentage}%
      </span>
      <div className="flex-1 min-w-0">
        {article.link ? (
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-1.5 text-lg leading-snug text-[var(--brand-primary)] hover:text-[var(--brand-accent-dark)] transition-colors"
          >
            {article.title_translated || article.title || '無標題'}
            <ExternalLink className="w-3 h-3 shrink-0 mt-1.5" />
          </a>
        ) : (
          <div className="text-lg leading-snug text-[var(--brand-primary)]">
            {article.title_translated || article.title || '無標題'}
          </div>
        )}
        {article.tldr && (
          <div className="text-base text-[var(--brand-text-muted)] mt-1">
            {article.tldr}
          </div>
        )}
      </div>
    </div>
  )
}

export function RelatedArticlesPanel({ articleId, onClose }: RelatedArticlesPanelProps) {
  const { data: relatedArticles, isLoading, error } = useSimilarArticles(articleId)

  return (
    <div
      className="mb-1 px-5 md:px-6 py-5 border-[3px] border-[var(--brand-primary)] outline outline-2 outline-[var(--brand-bg)] -outline-offset-[7px] flex flex-col gap-3.5"
      style={{
        background: 'var(--brand-featured-bg)',
        backgroundImage: 'radial-gradient(rgba(17,17,16,0.05) 1.5px, transparent 1.5px)',
        backgroundSize: '7px 7px',
        boxShadow: '6px 6px 0 var(--brand-accent)'
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-[9px] text-[var(--brand-primary)]">相關文獻 · RELATED</span>
        <button
          onClick={onClose}
          className="font-display flex items-center gap-1.5 text-[9px] text-[var(--brand-primary)] hover:text-[var(--brand-accent-dark)] transition-colors"
        >
          收合
          <ChevronUp className="w-2.5 h-2.5" />
        </button>
      </div>

      {isLoading && (
        <p className="text-base text-[var(--brand-text-muted)] py-2">{'// '}正在尋找相關文獻...</p>
      )}

      {error && (
        <p className="text-base text-[var(--brand-text-muted)] py-2">{'// '}載入相關文獻時發生錯誤</p>
      )}

      {relatedArticles && relatedArticles.length === 0 && (
        <p className="text-base text-[var(--brand-text-muted)] py-2">{'// '}找不到相關文獻，這篇文章的主題比較獨特</p>
      )}

      {relatedArticles && relatedArticles.length > 0 && (
        <div className="flex flex-col">
          {relatedArticles.map((item) => (
            <RelatedArticleRow key={item.id} article={item} />
          ))}
        </div>
      )}
    </div>
  )
}
