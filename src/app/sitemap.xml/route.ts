import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // 獲取所有文章 ID 和更新時間
    const { data: articles, error } = await supabase
      .from('rss_entries')
      .select('id, created_at, published')
      .order('created_at', { ascending: false })
      .limit(5000) // 限制數量避免 sitemap 過大

    if (error) {
      console.error('Error fetching articles for sitemap:', error)
      return generateBasicSitemap()
    }

    const baseUrl = 'https://audslp.app'
    const currentDate = new Date().toISOString()

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- 主頁 -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
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
  const baseUrl = 'https://audslp.app'
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
