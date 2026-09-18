'use client'

import { TrendingUp } from 'lucide-react'
import { useTrendingKeywords } from '@/hooks/useArticles'
import { cn } from '@/lib/utils'

interface TrendingKeywordsProps {
  onTermClick: (term: string) => void
  className?: string
}

export function TrendingKeywords({ onTermClick, className }: TrendingKeywordsProps) {
  const { data: keywords, isLoading } = useTrendingKeywords()

  const isEmpty = !isLoading && (!keywords || keywords.length === 0)

  return (
    <div className={cn('flex items-center gap-2.5 min-w-0', className)}>
      <div className="flex items-center gap-1.5 shrink-0">
        <TrendingUp className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
        <span className="font-display text-[9px] tracking-normal uppercase text-[var(--brand-primary)] whitespace-nowrap">
          Trending
        </span>
      </div>

      <div className="flex items-center gap-x-3 overflow-x-auto min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="inline-block h-3.5 w-16 shrink-0 bg-[var(--brand-primary)]/10 animate-pulse"
            />
          ))
        ) : isEmpty ? (
          <span className="text-sm text-[var(--brand-text-faint)] whitespace-nowrap">
            這段期間還沒有足夠的主題資料
          </span>
        ) : (
          keywords!.map(({ term, article_count }) => (
            <button
              key={term}
              type="button"
              onClick={() => onTermClick(term)}
              className="shrink-0 text-sm text-[var(--brand-text-faint)] hover:text-[var(--brand-accent-dark)] hover:underline transition-colors whitespace-nowrap"
            >
              #{term}
              <span className="text-[var(--brand-text-faint)]/60 ml-0.5">{article_count}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
