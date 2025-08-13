import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "聽語期刊速報 | 聽力學與語言治療期刊推播網站",
  description: "專業的聽力學與語言治療期刊推播網站，提供最新的學術研究、相關文章推薦和研究趨勢追蹤",
  keywords: "聽力學, 語言治療, 期刊, 學術研究, RSS, 醫學研究",
  authors: [{ name: "聽語期刊速報" }],
  openGraph: {
    title: "聽語期刊速報 | 聽力學與語言治療期刊推播網站",
    description: "專業的聽力學與語言治療期刊推播網站，提供最新的學術研究、相關文章推薦和研究趨勢追蹤",
    url: "https://audslp-rssviewer-2.vercel.app",
    siteName: "聽語期刊速報",
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "聽語期刊速報 | 聽力學與語言治療期刊推播網站",
    description: "專業的聽力學與語言治療期刊推播網站，提供最新的學術研究、相關文章推薦和研究趨勢追蹤",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}