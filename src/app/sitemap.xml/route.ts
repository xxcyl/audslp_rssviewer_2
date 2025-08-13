import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // 獲取所有文章 ID 和更新時間
    const { data: articles, error } = await supabase
      .from('rss_entries')
      .select('id, title_translated, created_at, published')
      .order('created_at', { ascending: false })
      .limit(5000) // 限制數量避免 sitemap 過大

    if (error) {
      console.error('Error fetching articles for sitemap:', error)
      return generateBasicSitemap()
    }

    const baseUrl = 'https://audslp.vercel.app'
    const currentDate = new Date().toISOString()

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- 主頁 -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- 搜尋頁面 -->
  <url>
    <loc>${baseUrl}/?search=audiology</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/?search=speech</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 分類頁面 -->
  <url>
    <loc>${baseUrl}/?source=Journal%20of%20Speech%2C%20Language%2C%20and%20Hearing%20Research</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${baseUrl}/?source=International%20Journal%20of%20Audiology</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`

    // 加入文章頁面
    if (articles) {
      for (const article of articles) {
        const lastmod = article.published || article.created_at
        const formattedDate = new Date(lastmod).toISOString()
        
        sitemap += `
  <!-- 文章 ID: ${article.id} -->
  <url>
    <loc>${baseUrl}/article/${article.id}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <news:news>
      <news:publication>
        <news:name>聽語期刊速報</news:name>
        <news:language>zh-tw</news:language>
      </news:publication>
      <news:publication_date>${formattedDate}</news:publication_date>
      <news:title><![CDATA[${article.title_translated || `文章 ${article.id}`}]]></news:title>
    </news:news>
  </url>`
      }
    }

    sitemap += `
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    return generateBasicSitemap()
  }
}

function generateBasicSitemap() {
  const baseUrl = 'https://audslp.vercel.app'
  const currentDate = new Date().toISOString()

  const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

  return new Response(basicSitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
