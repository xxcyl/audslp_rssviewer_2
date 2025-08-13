export function GET() {
  return new Response(
    `User-agent: *
Allow: /

# 主要 sitemap
Sitemap: https://audslp.vercel.app/sitemap.xml

# 備用域名 sitemap  
Sitemap: https://www.audslp.cc/sitemap.xml

# 爬蟲延遲設定
Crawl-delay: 1

# 特殊規則
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

# 禁止存取的路徑
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/

# 搜尋引擎特定設定
User-agent: Googlebot
Allow: /
Crawl-delay: 0.5

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2`,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    }
  )
}
