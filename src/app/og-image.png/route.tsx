import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// 與網站視覺系統一致：近黑底 (--brand-primary) + 螢光黃綠強調色 (--brand-accent)
const BRAND_PRIMARY = '#111110'
const BRAND_ACCENT = '#CBFF3D'
const BRAND_ACCENT_DARK = '#5B6B0C'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: BRAND_PRIMARY,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 2px, transparent 2px)',
          backgroundSize: '28px 28px',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FAFAF9',
          fontFamily: '"Courier New", monospace',
          position: 'relative',
        }}
      >
        {/* EQ / 聲波圖示，呼應網站 favicon */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '48px' }}>
          {[36, 62, 88, 54, 30].map((h, i) => (
            <div
              key={i}
              style={{ width: '22px', height: `${h}px`, background: BRAND_ACCENT }}
            />
          ))}
        </div>

        {/* 主標題：比照網站 header 的 [ 標題 ]_ 樣式 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '76px',
            fontWeight: 700,
            marginBottom: '24px',
          }}
        >
          <span style={{ color: BRAND_ACCENT }}>[</span>
          <span>聽語期刊速報</span>
          <span style={{ color: BRAND_ACCENT }}>]</span>
          <span style={{ color: BRAND_ACCENT }}>_</span>
        </div>

        {/* 副標題 */}
        <div
          style={{
            fontSize: '28px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: BRAND_ACCENT,
            fontWeight: 700,
            marginBottom: '56px',
          }}
        >
          Audiology &amp; SLP Digest
        </div>

        {/* 特色標籤：比照網站的外框徽章樣式 */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {['AI 智慧推薦', '跨期刊搜尋', '證據等級標示'].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                border: `2px solid ${BRAND_ACCENT_DARK}`,
                color: BRAND_ACCENT,
                padding: '14px 26px',
                fontSize: '22px',
                fontWeight: 700,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* 網址 */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            fontSize: '22px',
            color: 'rgba(250,250,249,0.5)',
            letterSpacing: '0.05em',
          }}
        >
          audslp.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
