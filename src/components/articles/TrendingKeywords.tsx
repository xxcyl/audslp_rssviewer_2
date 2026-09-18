'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { useTrendingKeywords } from '@/hooks/useArticles'
import { cn } from '@/lib/utils'

interface TrendingKeywordsProps {
  onTermClick: (term: string) => void
  className?: string
}

export function TrendingKeywords({ onTermClick, className }: TrendingKeywordsProps) {
  const [daysBack, setDaysBack] = useState<7 | 30>(7)
  const { data: keywords, isLoading } = useTrendingKeywords(daysBack)

  if (!isLoading && (!keywords || keywords.length === 0)) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      <div className="flex items-center gap-1.5 shrink-0">
        <TrendingUp className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
        <span className="font-display text-[9px] tracking-normal uppercase text-[var(--brand-primary)]">
          Trending
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {([7, 30] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setDaysBack(option)}
            className={cn(
              'font-display text-[8px] px-1.5 py-1 transition-colors',
              daysBack === option
                ? 'bg-[var(--brand-primary)] text-[var(--brand-accent)]'
                : 'text-[var(--brand-text-faint)] hover:text-[var(--brand-primary)]'
            )}
          >
            {option === 7 ? '本週' : '本月'}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-[var(--brand-primary)]/15 shrink-0" />

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 min-w-0">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="inline-block h-3.5 w-16 bg-[var(--brand-primary)]/10 animate-pulse"
              />
            ))
          : keywords!.map(({ term, article_count }) => (
              <button
                key={term}
                type="button"
                onClick={() => onTermClick(term)}
                className="text-sm text-[var(--brand-text-faint)] hover:text-[var(--brand-accent-dark)] hover:underline transition-colors"
              >
                #{term}
                <span className="text-[var(--brand-text-faint)]/60 ml-0.5">{article_count}</span>
              </button>
            ))}
      </div>
    </div>
  )
}
