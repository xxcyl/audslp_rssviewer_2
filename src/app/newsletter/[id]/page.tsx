import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Calendar, ExternalLink, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { NewsletterIssue } from '@/lib/types'

interface NewsletterPageProps {
  params: Promise<{ id: string }>
}

// 同一次請求裡 generateMetadata 跟頁面本體都會呼叫，用 cache() 包起來避免重複查詢
const getIssue = cache(async (id: string): Promise<NewsletterIssue | null> => {
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) return null

  const { data, error } = await supabase
    .from('newsletter_issues')
    .select('*')
    .eq('id', numericId)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !data) return null
  return data as NewsletterIssue
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export async function generateMetadata({ params }: NewsletterPageProps): Promise<Metadata> {
  const { id } = await params
  const issue = await getIssue(id)

  if (!issue) {
    return { title: '找不到週報' }
  }

  return {
    title: issue.title,
    description: `涵蓋 ${formatDate(issue.period_start)} 至 ${formatDate(issue.period_end)}，共 ${issue.article_count} 篇文章`,
    // 測試階段先不開放索引，等正式對外發布後再拿掉
    robots: { index: false, follow: false }
  }
}

export default async function NewsletterIssuePage({ params }: NewsletterPageProps) {
  const { id } = await params
  const issue = await getIssue(id)

  if (!issue) {
    notFound()
  }

  const sortedCitations = [...issue.citations].sort((a, b) => a.order - b.order)

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
        <Link
          href="/newsletter"
          className="font-pixel-body inline-block text-sm text-[var(--brand-text-muted)] hover:text-[var(--brand-accent-dark)] transition-colors mb-6"
        >
          ← 所有週報
        </Link>

        <div className="flex flex-col gap-2.5 mb-6">
          <span className="flex items-center gap-1 text-base text-[var(--brand-text-faint)]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(issue.period_start)} – {formatDate(issue.period_end)}
          </span>
          <span className="font-display inline-block w-fit text-[8px] leading-relaxed tracking-wide uppercase border-[1.5px] border-[var(--brand-border)] text-[var(--brand-text-muted)] px-1.5 py-1">
            {issue.article_count} ARTICLES
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl leading-snug font-semibold text-[var(--brand-primary)] mb-8">
          {issue.title}
        </h1>

        <div className="newsletter-markdown">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-[var(--brand-primary)] mt-10 mb-3 first:mt-0">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-relaxed text-[var(--brand-text)] mb-4">
                  {children}
                </p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--brand-accent-dark)] hover:underline"
                >
                  {children}
                </a>
              )
            }}
          >
            {issue.summary_markdown}
          </ReactMarkdown>
        </div>

        {sortedCitations.length > 0 && (
          <div className="mt-10 pt-8 border-t border-[var(--brand-border)]">
            <h2 className="font-display text-[10px] tracking-wide uppercase text-[var(--brand-text-muted)] mb-4">
              References
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {sortedCitations.map((citation) => (
                <li key={citation.pmid} className="text-sm text-[var(--brand-text-faint)]">
                  <span className="font-pixel-body">[{citation.order}]</span>{' '}
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-pixel-body inline-flex items-center gap-1 hover:text-[var(--brand-accent-dark)] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    PMID {citation.pmid}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-8 flex items-center gap-1 text-sm text-[var(--brand-text-faint)]">
          <FileText className="w-3.5 h-3.5" />
          發布於 {issue.published_at ? formatDate(issue.published_at) : formatDate(issue.created_at)}
        </div>
      </div>
    </div>
  )
}
