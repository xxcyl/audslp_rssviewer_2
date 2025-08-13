// 簡化版 OG 圖片生成
export const runtime = 'edge'

export async function GET() {
  // 創建一個簡單的 SVG 圖片
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- 背景 -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- 主要內容 -->
      <text x="600" y="200" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">📚 聽語期刊速報</text>
      
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="40" fill="rgba(255,255,255,0.9)" text-anchor="middle">聽力學與語言治療期刊推播網站</text>
      
      <!-- 特色標籤 -->
      <rect x="200" y="350" width="200" height="50" rx="25" fill="rgba(255,255,255,0.2)"/>
      <text x="300" y="380" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">AI 智能推薦</text>
      
      <rect x="450" y="350" width="200" height="50" rx="25" fill="rgba(255,255,255,0.2)"/>
      <text x="550" y="380" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">跨期刊搜尋</text>
      
      <rect x="700" y="350" width="200" height="50" rx="25" fill="rgba(255,255,255,0.2)"/>
      <text x="800" y="380" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">最新研究追蹤</text>
      
      <!-- 網址 -->
      <text x="600" y="480" font-family="monospace" font-size="28" fill="rgba(255,255,255,0.8)" text-anchor="middle">audslp.vercel.app</text>
      
      <!-- 版權 -->
      <text x="1100" y="600" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.7)" text-anchor="end">© 2025 專業期刊推播</text>
    </svg>
  `

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400', // 24 小時快取
    },
  })
}
