import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = '聽語期刊速報 - 專業期刊推播網站'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* 背景裝飾 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* 主要內容 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px',
            maxWidth: '1000px',
          }}
        >
          {/* Icon/Emoji */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '30px',
            }}
          >
            📚
          </div>
          
          {/* 主標題 */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
            }}
          >
            聽語期刊速報
          </h1>
          
          {/* 副標題 */}
          <p
            style={{
              fontSize: '36px',
              margin: '0 0 40px 0',
              opacity: 0.9,
              fontWeight: 500,
            }}
          >
            聽力學與語言治療期刊推播網站
          </p>
          
          {/* 特色標籤 */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
              AI 智能推薦
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
              跨期刊搜尋
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
              最新研究追蹤
            </div>
          </div>
          
          {/* 網址 */}
          <div
            style={{
              marginTop: '50px',
              fontSize: '24px',
              opacity: 0.8,
              fontFamily: 'monospace',
            }}
          >
            audslp.vercel.app
          </div>
        </div>
        
        {/* 底部裝飾 */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            fontSize: '18px',
            opacity: 0.7,
          }}
        >
          © 2025 專業期刊推播
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
