import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, ExternalLink, FileText, FlaskConical, Unlock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getEvidenceLabel, getPrimaryEvidenceType, evidenceBadgeStyle } from '@/lib/publicationTypes'
import { ArticlePageJsonLd } from '@/components/seo/JsonLd'
import { ArticleDetailClient } from '@/components/articles/ArticleDetailClient'
import type { Article } from '@/lib/types'

interface ArticlePageProps {
  params: Promise<{ id: string }>
}

// 同一次請求裡 generateMetadata 跟頁面本體都會呼叫，用 cache() 包起來避免重複查詢
const getArticle = cache(async (id: string): Promise<Article | null> => {
  const numericId = Number(id)
  if (!Number.isInteger(numericId)) return null

  const { data, error } = await supabase
    .from('rss_entries')
    .select('*')
    .eq('id', numericId)
    .maybeSingle()

  if (error || !data) return null
  return data as Article
})

function formatDate(dateString: string | null) {
  if (!dateString) return '未知日期'
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    return { title: '找不到文章' }
  }

  const title = article.title_translated || article.title || `文章 ${article.id}`
  const description = article.tldr || article.english_tldr || '學術文章摘要'
  const url = `https://audslp.vercel.app/article/${article.id}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: article.published ?? undefined
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  const evidenceType = getPrimaryEvidenceType(article.publication_types)

  return (
    <div className="min-h-screen bg-[var(--brand-bg)]">
      <ArticlePageJsonLd article={article} />

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
        <div className="flex flex-col gap-2.5 mb-6">
          <span className="font-display inline-block w-fit text-[8px] leading-relaxed tracking-wide uppercase bg-[var(--brand-accent)] text-[var(--brand-primary)] px-1.5 py-1">
            {article.source || 'Unknown Source'}
          </span>
          <span className="flex items-center gap-1 text-base text-[var(--brand-text-faint)]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(article.created_at)}
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

        <h1 className="text-3xl md:text-4xl leading-snug font-semibold text-[var(--brand-primary)] mb-2">
          {article.title_translated || article.title || '無標題'}
        </h1>

        {article.title && article.title_translated && (
          <p className="text-base leading-relaxed text-[var(--brand-text-muted)] mb-4">
            {'// '}{article.title}
          </p>
        )}

        {article.tldr && (
          <p className="text-lg leading-relaxed text-[var(--brand-text)] mb-3">
            {article.tldr}
          </p>
        )}

        {article.english_tldr && (
          <p className="text-base leading-relaxed text-[var(--brand-text-muted)] mb-4">
            {'// '}{article.english_tldr}
          </p>
        )}

        {article.mesh_terms && article.mesh_terms.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-6">
            {article.mesh_terms.map((term) => (
              <span key={term} className="text-sm text-[var(--brand-text-faint)]">
                #{term}
              </span>
            ))}
          </div>
        )}

        {article.published && (
          <p className="text-sm text-[var(--brand-text-faint)] mb-1.5">
            Published {formatDate(article.published)}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-base text-[var(--brand-primary)] mb-8 pb-8 border-b border-[var(--brand-border)]">
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[var(--brand-accent-dark)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
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
              <FileText className="w-3.5 h-3.5" />
              DOI
            </a>
          )}
        </div>

        <ArticleDetailClient article={article} />
      </div>
    </div>
  )
}
