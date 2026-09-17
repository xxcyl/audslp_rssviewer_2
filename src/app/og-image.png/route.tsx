import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// 與網站視覺系統一致：近黑底 (--brand-primary) + 螢光黃綠強調色 (--brand-accent)
const BRAND_PRIMARY = '#111110'
const BRAND_ACCENT = '#CBFF3D'
const BRAND_ACCENT_DARK = '#5B6B0C'

// LED 分段式 EQ 長條，呼應復古 8-bit 音量表，比實心色塊更有像素感
function EqBar({ height, segments }: { height: number; segments: number }) {
  const gap = 5
  const segH = (height - gap * (segments - 1)) / segments
  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: `${gap}px` }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} style={{ width: '22px', height: `${segH}px`, background: BRAND_ACCENT }} />
      ))}
    </div>
  )
}

export async function GET() {
  // 動態載入 Press Start 2P 像素字體（@vercel/og 只支援 ttf/otf/woff，不支援 woff2）
  const pixelFontData = await fetch(
    'https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK3nVivY.ttf'
  ).then((res) => res.arrayBuffer())

  // 主標題的中文字跟 [ ] _ 括號原本落在不同 fallback 字型，字級/基線對不齊。
  // 改成明確載入同一個中文字型（Google 依 text 參數回傳的裁切子集，僅含這幾個字），
  // 讓整行標題（中英文、符號）都用同一套字型度量繪製。
  const titleFontData = await fetch(
    'https://fonts.gstatic.com/l/font?kit=-nFuOG829Oofr2wohFbTp9ifNAn722rq0MXz70e1_CpWpzXr_zBDItm8U7hM11ENFJsJSO9sCg&skey=3904269dc8bdd0a1&v=v39'
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          background: BRAND_PRIMARY,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 2px, transparent 2px)',
          backgroundSize: '24px 24px',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FAFAF9',
          fontFamily: '"Courier New", monospace',
          position: 'relative',
          border: `14px solid ${BRAND_ACCENT}`,
          boxSizing: 'border-box',
        }}
      >
        {/* EQ / 聲波圖示，呼應網站 favicon 的 LED 分段風格 */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginBottom: '48px' }}>
          {[
            [36, 3],
            [62, 5],
            [88, 7],
            [54, 4],
            [30, 3],
          ].map(([h, segs], i) => (
            <EqBar key={i} height={h} segments={segs} />
          ))}
        </div>

        {/* 主標題：比照網站 header 的 [ 標題 ]_ 樣式；中文跟符號共用同一個明確載入的
            字型，避免中文落到 fallback 字型、跟符號字級/基線對不齊 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '72px',
            fontFamily: '"Noto Sans TC"',
            fontWeight: 700,
            marginBottom: '32px',
          }}
        >
          <span style={{ color: BRAND_ACCENT }}>[</span>
          <span>聽語期刊速報</span>
          <span style={{ color: BRAND_ACCENT }}>]</span>
          <span style={{ color: BRAND_ACCENT }}>_</span>
        </div>

        {/* 副標題：像素字體 */}
        <div
          style={{
            fontFamily: '"Press Start 2P"',
            fontSize: '20px',
            letterSpacing: '0.1em',
            color: BRAND_ACCENT,
            marginBottom: '56px',
          }}
        >
          AUDIOLOGY &amp; SLP DIGEST
        </div>

        {/* 特色標籤：像素字體 + 硬邊偏移陰影，呼應網站卡片的復古描邊風格 */}
        <div style={{ display: 'flex', gap: '32px' }}>
          {['AI PICKS', 'CROSS-JOURNAL SEARCH', 'EVIDENCE TIER'].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                border: `2px solid ${BRAND_ACCENT}`,
                color: BRAND_ACCENT,
                padding: '14px 20px',
                fontFamily: '"Press Start 2P"',
                fontSize: '13px',
                boxShadow: `6px 6px 0 ${BRAND_ACCENT_DARK}`,
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
            bottom: '40px',
            fontFamily: '"Press Start 2P"',
            fontSize: '16px',
            color: 'rgba(250,250,249,0.5)',
          }}
        >
          audslp.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Press Start 2P',
          data: pixelFontData,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Noto Sans TC',
          data: titleFontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
