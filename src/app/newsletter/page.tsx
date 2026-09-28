import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { NewsletterIssue } from '@/lib/types'

export const metadata: Metadata = {
  title: '聽語期刊週報',
  description: '每週彙整聽力學與語言治療領域新增期刊文章的摘要電子報',
  // 測試階段先不開放索引，等正式對外發布後再拿掉
  robots: { index: false, follow: false }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function getPublishedIssues(): Promise<Pick<NewsletterIssue, 'id' | 'period_start' | 'period_end' | 'title' | 'article_count' | 'published_at'>[]> {
  const { data, error } = await supabase
    .from('newsletter_issues')
    .select('id, period_start, period_end, title, article_count, published_at')
    .eq('status', 'published')
    .order('period_start', { ascending: false })

  if (error || !data) return []
  return data
}

export default async function NewsletterListPage() {
  const issues = await getPublishedIssues()

  return (
    <div className="min-h-screen bg-[var(--brand-bg)]">
      <header className="bg-[var(--brand-primary)] py-3">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-1 w-fit text-[#FAFAF9] whitespace-nowrap hover:opacity-80 transition-opacity"
          >
            <span className="font-display text-xs md:text-sm">[</span>
            <span className="text-sm md:text-base font-bold tracking-wide">聽語期刊速報</span>
            <span className="font-display text-xs md:text-sm">]</span>
            <span className="font-display text-xs md:text-sm text-[var(--brand-accent)]">_</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl leading-snug font-semibold text-[var(--brand-primary)] mb-2">
          聽語期刊週報
        </h1>
        <p className="text-lg text-[var(--brand-text-muted)] mb-8">
          每週彙整新增期刊文章的摘要電子報
        </p>

        {issues.length === 0 ? (
          <p className="text-base text-[var(--brand-text-faint)]">目前還沒有已發布的週報。</p>
        ) : (
          <>
            {/* 最新一期比照首頁 Random Pick 卡片的螢光強調樣式，其餘期數維持素樸列表 */}
            <Link
              href={`/newsletter/${issues[0].id}`}
              className="group block mb-8 px-5 md:px-8 py-6 border-4 border-[var(--brand-primary)] outline outline-3 outline-[var(--brand-bg)] -outline-offset-[9px]"
              style={{
                background: 'var(--brand-featured-bg)',
                backgroundImage: 'radial-gradient(rgba(17,17,16,0.05) 1.5px, transparent 1.5px)',
                backgroundSize: '7px 7px',
                boxShadow: '8px 8px 0 var(--brand-accent)'
              }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                <span className="font-display text-[9px] tracking-normal uppercase text-[var(--brand-primary)]">
                  Latest Issue
                </span>
              </div>
              <span className="flex items-center gap-1 text-sm text-[var(--brand-text-faint)]">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(issues[0].period_start)} – {formatDate(issues[0].period_end)}
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--brand-primary)] group-hover:text-[var(--brand-accent-dark)] transition-colors mt-2 mb-3">
                {issues[0].title}
              </h2>
              <span className="font-display w-fit text-[8px] leading-relaxed tracking-wide uppercase bg-[var(--brand-accent)] text-[var(--brand-primary)] px-1.5 py-1">
                {issues[0].article_count} ARTICLES
              </span>
            </Link>

            {issues.length > 1 && (
              <div className="flex flex-col divide-y divide-[var(--brand-border)]">
                {issues.slice(1).map((issue) => (
                  <Link
                    key={issue.id}
                    href={`/newsletter/${issue.id}`}
                    className="group py-6 flex flex-col gap-2"
                  >
                    <span className="flex items-center gap-1 text-sm text-[var(--brand-text-faint)]">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(issue.period_start)} – {formatDate(issue.period_end)}
                    </span>
                    <h2 className="text-2xl font-semibold text-[var(--brand-primary)] group-hover:text-[var(--brand-accent-dark)] transition-colors">
                      {issue.title}
                    </h2>
                    <span className="font-display w-fit text-[8px] leading-relaxed tracking-wide uppercase bg-[var(--brand-accent)] text-[var(--brand-primary)] px-1.5 py-1">
                      {issue.article_count} ARTICLES
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
