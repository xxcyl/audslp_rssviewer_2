import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // 獲取最新的 50 篇文章
    const { data: articles, error } = await supabase
      .from('rss_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching articles for RSS:', error)
      return new Response('Error generating RSS feed', { status: 500 })
    }

    const baseUrl = 'https://audslp.vercel.app'
    const currentDate = new Date().toUTCString()

    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>聽語期刊速報 | 聽力學與語言治療期刊推播</title>
    <description>專業的聽力學與語言治療期刊推播網站，提供最新的學術研究、AI 智能推薦、跨期刊文章搜尋和研究趨勢追蹤。涵蓋聽力學、語言治療、溝通障礙等專業領域。</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>zh-TW</language>
    <category>醫學研究</category>
    <category>聽力學</category>
    <category>語言治療</category>
    <category>學術期刊</category>
    <copyright>© 2025 聽語期刊速報. All rights reserved.</copyright>
    <managingEditor>contact@audslp.vercel.app (聽語期刊速報)</managingEditor>
    <webMaster>webmaster@audslp.vercel.app (聽語期刊速報技術團隊)</webMaster>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <generator>聽語期刊速報 RSS Generator</generator>
    <image>
      <url>${baseUrl}/favicon.ico</url>
      <title>聽語期刊速報</title>
      <link>${baseUrl}</link>
      <width>32</width>
      <height>32</height>
    </image>
    <ttl>60</ttl>
`

    if (articles) {
      for (const article of articles) {
        const pubDate = article.published 
          ? new Date(article.published).toUTCString()
          : new Date(article.created_at).toUTCString()
        
        const title = article.title_translated || article.title || `文章 ${article.id}`
        const description = article.tldr || article.english_tldr || '暫無摘要'
        const link = article.link || `${baseUrl}/article/${article.id}`
        const guid = `${baseUrl}/article/${article.id}`
        
        // 清理 HTML 和特殊字符
        const cleanTitle = title.replace(/[<>&\"\']/g, (match) => {
          const entities: Record<string, string> = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '\"': '&quot;',
            \"'\": '&apos;'
          }
          return entities[match] || match
        })
        
        const cleanDescription = description.replace(/[<>&\"\']/g, (match) => {
          const entities: Record<string, string> = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '\"': '&quot;',
            \"'\": '&apos;'
          }
          return entities[match] || match
        })

        rss += `
    <item>
      <title><![CDATA[${cleanTitle}]]></title>
      <description><![CDATA[${cleanDescription}]]></description>
      <link>${link}</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <source url="${baseUrl}/rss.xml">聽語期刊速報</source>
      <category>${article.source || '期刊文章'}</category>
      ${article.pmid ? `<category>PMID:${article.pmid}</category>` : ''}
      ${article.doi ? `<category>DOI:${article.doi}</category>` : ''}
      <content:encoded><![CDATA[
        <h3>中文摘要</h3>
        <p>${article.tldr || '暫無中文摘要'}</p>
        ${article.english_tldr ? `<h3>English Summary</h3><p>${article.english_tldr}</p>` : ''}
        <hr>
        <p><strong>期刊來源:</strong> ${article.source || '未知'}</p>
        ${article.pmid ? `<p><strong>PMID:</strong> ${article.pmid}</p>` : ''}
        ${article.doi ? `<p><strong>DOI:</strong> <a href="https://doi.org/${article.doi}" target="_blank">${article.doi}</a></p>` : ''}
        <p><strong>閱讀原文:</strong> <a href="${link}" target="_blank">點擊查看</a></p>
        <p><strong>在網站上查看:</strong> <a href="${baseUrl}/article/${article.id}" target="_blank">查看詳情和相關推薦</a></p>
      ]]></content:encoded>
    </item>`
      }
    }

    rss += `
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800' // 30 分鐘快取
      }
    })

  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
