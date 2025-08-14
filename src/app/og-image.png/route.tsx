import { ImageResponse } from 'next/og'

export const runtime = 'edge'

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
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* 背景裝飾圓點 */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '50px',
            width: '60px',
            height: '60px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
          }}
        />
        
        {/* 主要內容容器 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '80px 60px',
            maxWidth: '1000px',
          }}
        >
          {/* 書籍圖示 */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '40px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
            }}
          >
            📚
          </div>
          
          {/* 主標題 */}
          <h1
            style={{
              fontSize: '80px',
              fontWeight: '700',
              margin: '0 0 30px 0',
              lineHeight: '0.9',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            聽語期刊速報
          </h1>
          
          {/* 副標題 */}
          <p
            style={{
              fontSize: '36px',
              margin: '0 0 50px 0',
              opacity: 0.9,
              fontWeight: '400',
              lineHeight: '1.2',
            }}
          >
            聽力學與語言治療期刊推播網站
          </p>
          
          {/* 特色標籤容器 */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '50px',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.25)',
                padding: '16px 28px',
                borderRadius: '30px',
                fontSize: '22px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              AI 智慧推薦
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.25)',
                padding: '16px 28px',
                borderRadius: '30px',
                fontSize: '22px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              跨期刊搜尋
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.25)',
                padding: '16px 28px',
                borderRadius: '30px',
                fontSize: '22px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              最新研究追蹤
            </div>
          </div>
          
          {/* 網址 */}
          <div
            style={{
              fontSize: '28px',
              opacity: 0.8,
              fontFamily: '"JetBrains Mono", "Courier New", monospace',
              background: 'rgba(255,255,255,0.1)',
              padding: '12px 24px',
              borderRadius: '15px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            audslp.vercel.app
          </div>
        </div>
        
        {/* 版權標示 */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '40px',
            fontSize: '18px',
            opacity: 0.6,
            fontWeight: '400',
          }}
        >
          © 2025 專業期刊推播
        </div>
        
        {/* 左下角裝飾 */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '40px',
            fontSize: '16px',
            opacity: 0.5,
            fontWeight: '500',
          }}
        >
          🔬 學術研究 | 🧠 AI 推薦
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
