import { Article } from '@/lib/types'

interface JsonLdProps {
  type: 'website' | 'article' | 'organization'
  data?: Article
}

export function JsonLd({ type, data }: JsonLdProps) {
  const baseUrl = 'https://audslp.vercel.app'
  
  const generateStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: '聽語期刊速報',
          alternateName: 'AudSLP RSS Viewer',
          url: baseUrl,
          description: '專業的聽力學與語言治療期刊推播網站，提供最新的學術研究、AI 智能推薦、跨期刊文章搜尋和研究趨勢追蹤。',
          inLanguage: 'zh-TW',
          publisher: {
            '@type': 'Organization',
            name: '聽語期刊速報',
            url: baseUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/favicon.ico`,
              width: 32,
              height: 32
            }
          },
          potentialAction: [
            {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/?search={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            }
          ],
          mainEntity: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/#main`,
            name: '聽語期刊速報 - 首頁',
            description: '瀏覽最新的聽力學與語言治療期刊文章',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: '首頁',
                  item: baseUrl
                }
              ]
            }
          },
          sameAs: [
            'https://www.audslp.cc'
          ],
          keywords: [
            '聽力學', '語言治療', '期刊', '學術研究', 'RSS', '醫學研究',
            '聽力師', '語言治療師', '溝通障礙', '聽力損失', '語言發展',
            '復健醫學', '聽覺處理', '言語病理學', '聽語專業', '期刊推播',
            'AI推薦', '學術文獻', 'PubMed', '研究追蹤'
          ],
          about: [
            {
              '@type': 'Thing',
              name: '聽力學',
              sameAs: 'https://zh.wikipedia.org/wiki/聽力學'
            },
            {
              '@type': 'Thing', 
              name: '語言治療',
              sameAs: 'https://zh.wikipedia.org/wiki/語言治療'
            },
            {
              '@type': 'Thing',
              name: '醫學期刊',
              sameAs: 'https://zh.wikipedia.org/wiki/醫學期刊'
            }
          ]
        }

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: '聽語期刊速報',
          alternateName: 'AudSLP RSS Viewer',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/favicon.ico`,
            width: 32,
            height: 32
          },
          description: '專業的聽力學與語言治療期刊推播網站',
          foundingDate: '2025',
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'contact@audslp.vercel.app',
            availableLanguage: ['zh-TW', 'en']
          },
          areaServed: {
            '@type': 'Country',
            name: '台灣'
          },
          knowsAbout: [
            '聽力學',
            '語言治療', 
            '復健醫學',
            '醫學研究',
            '學術期刊',
            '溝通障礙'
          ],
          sameAs: [
            'https://www.audslp.cc'
          ]
        }

      case 'article':
        if (!data) return null
        
        return {
          '@context': 'https://schema.org',
          '@type': 'ScholarlyArticle',
          headline: data.title_translated || data.title || `文章 ${data.id}`,
          alternativeHeadline: data.title !== data.title_translated ? data.title : undefined,
          description: data.tldr || data.english_tldr || '學術文章摘要',
          url: data.link || `${baseUrl}/article/${data.id}`,
          identifier: [
            ...(data.pmid ? [{ '@type': 'PropertyValue', name: 'PMID', value: data.pmid }] : []),
            ...(data.doi ? [{ '@type': 'PropertyValue', name: 'DOI', value: data.doi }] : []),
            { '@type': 'PropertyValue', name: 'ID', value: data.id.toString() }
          ],
          datePublished: data.published || data.created_at,
          dateModified: data.created_at,
          inLanguage: 'zh-TW',
          publisher: {
            '@type': 'Organization',
            name: data.source || '學術期刊',
            url: baseUrl
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/article/${data.id}`
          },
          author: {
            '@type': 'Organization',
            name: data.source || '期刊作者'
          },
          keywords: [
            '聽力學',
            '語言治療',
            '醫學研究',
            data.source || '學術期刊'
          ],
          about: [
            {
              '@type': 'Thing',
              name: '聽力學研究'
            },
            {
              '@type': 'Thing',
              name: '語言治療研究'
            }
          ],
          isPartOf: {
            '@type': 'Periodical',
            name: data.source || '學術期刊',
            issn: data.doi ? data.doi.split('/')[0] : undefined
          },
          citation: data.doi ? `https://doi.org/${data.doi}` : undefined,
          sameAs: data.doi ? `https://doi.org/${data.doi}` : undefined
        }

      default:
        return null
    }
  }

  const structuredData = generateStructuredData()
  
  if (!structuredData) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}

// 專用於首頁的組合結構化資料
export function HomePageJsonLd() {
  return (
    <>
      <JsonLd type="website" />
      <JsonLd type="organization" />
    </>
  )
}

// 專用於文章詳情頁的結構化資料
export function ArticlePageJsonLd({ article }: { article: Article }) {
  return <JsonLd type="article" data={article} />
}
