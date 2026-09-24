import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 基本設定
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 圖片最佳化
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 重定向設定
  async redirects() {
    return [
      // 舊網址（Vercel 預設子網域）全站轉址到正式網域 audslp.app，
      // 避免新舊網址被視為重複內容，也讓舊網址累積的索引進度能轉移過去
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'audslp.vercel.app' }],
        destination: 'https://audslp.app/:path*',
        permanent: true,
      },
      // 備用域名重定向到主要域名
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/rss.xml',
        permanent: true,
      },
    ]
  },
  
  // Headers 設定
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600'
          }
        ]
      },
      {
        source: '/rss.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=1800'
          }
        ]
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600'
          }
        ]
      }
    ]
  },
  
  // 實驗性功能
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default nextConfig;
