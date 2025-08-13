// Google Search Console 驗證檔案
// 當你需要驗證網站所有權時，Google 會提供一個驗證碼
// 將該驗證碼加入到環境變數 NEXT_PUBLIC_GOOGLE_VERIFICATION 中

export function GET() {
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION

  if (!googleVerification) {
    return new Response('Google verification not configured', { status: 404 })
  }

  const html = `
google-site-verification: google${googleVerification}.html
  `.trim()

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // 24 小時快取
    },
  })
}
