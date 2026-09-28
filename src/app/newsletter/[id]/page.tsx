import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Calendar, FileText, List } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { NewsletterIssue } from '@/lib/types'

interface NewsletterPageProps {
  params: Promise<{ id: string }>
}

// supabase-js 的 fetch 不一定會被 Next.js 判定為「未快取」進而自動選擇動態渲染，
// 明確加上 force-dynamic 確保每次請求都重新查詢，新發布的週報才會即時出現
export const dynamic = 'force-dynamic'

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

// 從正文抓出 ## 段落標題，做成目錄；react-markdown 渲染 h2 時用同一套計數器
// 編號，兩邊順序保證一致，錨點才會對得上
function extractHeadings(markdown: string): string[] {
  const matches = markdown.match(/^## (.+)$/gm) || []
  return matches.map((line) => line.replace(/^## /, ''))
}

// 週報產生階段就會把引用連結直接寫成站內的 /article/{id}，這裡不用再
// 查資料庫轉換；只在連結不是站內文章（例如少數例外情況）時才視為外部
// 連結另開分頁，其餘一律當作站內連結處理
function toInternalArticlePath(url: string): string | null {
  const match = url.match(/^https?:\/\/(?:www\.)?audslp\.app(\/article\/\d+)$/)
  return match ? match[1] : null
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

  const headings = extractHeadings(issue.summary_markdown)
  let headingIndex = 0
  let citationIndex = 0

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

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="flex items-center gap-1 text-base text-[var(--brand-text-faint)]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(issue.period_start)} – {formatDate(issue.period_end)}
          </span>
          <span className="font-display inline-block w-fit text-[8px] leading-relaxed tracking-wide uppercase bg-[var(--brand-accent)] text-[var(--brand-primary)] px-1.5 py-1">
            {issue.article_count} ARTICLES
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl leading-snug font-semibold text-[var(--brand-primary)] mb-8">
          {issue.title}
        </h1>

        {headings.length > 1 && (
          <nav
            className="mb-10 px-5 md:px-6 py-5 border-[3px] border-[var(--brand-primary)] outline outline-2 outline-[var(--brand-bg)] -outline-offset-[7px]"
            style={{
              background: 'var(--brand-featured-bg)',
              backgroundImage: 'radial-gradient(rgba(17,17,16,0.05) 1.5px, transparent 1.5px)',
              backgroundSize: '7px 7px',
              boxShadow: '5px 5px 0 var(--brand-accent)'
            }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <List className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
              <span className="font-display text-[9px] tracking-normal uppercase text-[var(--brand-primary)]">
                Contents
              </span>
            </div>
            <ol className="flex flex-col gap-1.5">
              {headings.map((heading, index) => (
                <li key={index}>
                  <a
                    href={`#section-${index}`}
                    className="text-base text-[var(--brand-text-muted)] hover:text-[var(--brand-accent-dark)] transition-colors"
                  >
                    <span className="font-pixel-body text-[var(--brand-text-faint)] mr-1.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="newsletter-markdown">
          <ReactMarkdown
            components={{
              h2: ({ children }) => {
                const index = headingIndex++
                return (
                  <h2
                    id={`section-${index}`}
                    className="flex items-baseline gap-2 text-2xl font-bold text-[var(--brand-primary)] mt-12 mb-4 pt-8 border-t border-[var(--brand-border)] first:mt-0 first:pt-0 first:border-t-0"
                  >
                    <span className="font-display text-[10px] text-[var(--brand-accent-dark)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {children}
                  </h2>
                )
              },
              p: ({ children }) => (
                <p className="text-lg leading-loose text-[var(--brand-text)] mb-4">
                  {children}
                </p>
              ),
              // 正文裡的引用連結原本都是「連結」這個字，重複出現太多次很雜；
              // 原文用全形括號把連結包起來當作附註，這裡改成只顯示流水號，
              // 靠括號本身當視覺分隔，不用額外再包一層方括號。連結本身在
              // 週報產生階段就已經是站內文章頁網址，這裡直接使用即可
              a: ({ href }) => {
                const n = ++citationIndex
                const className = "font-pixel-body text-xs align-super text-[var(--brand-accent-dark)] hover:underline"
                const internalPath = href ? toInternalArticlePath(href) : null

                if (internalPath) {
                  return (
                    <Link href={internalPath} className={className}>
                      {n}
                    </Link>
                  )
                }

                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                    {n}
                  </a>
                )
              }
            }}
          >
            {issue.summary_markdown}
          </ReactMarkdown>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--brand-border)] flex items-center gap-1 text-sm text-[var(--brand-text-faint)]">
          <FileText className="w-3.5 h-3.5" />
          發布於 {issue.published_at ? formatDate(issue.published_at) : formatDate(issue.created_at)}
        </div>
      </div>
    </div>
  )
}
