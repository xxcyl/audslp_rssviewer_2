import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "聽語期刊速報 | 聽力學與語言治療期刊推播網站",
    template: "%s | 聽語期刊速報"
  },
  description: "專業的聽力學與語言治療期刊推播網站，提供最新的學術研究、AI 智能推薦、跨期刊文章搜尋和研究趨勢追蹤。涵蓋聽力學、語言治療、溝通障礙等專業領域。",
  keywords: [
    "聽力學", "語言治療", "期刊", "學術研究", "RSS", "醫學研究",
    "聽力師", "語言治療師", "溝通障礙", "聽力損失", "語言發展",
    "復健醫學", "聽覺處理", "言語病理學", "聽語專業", "期刊推播",
    "AI推薦", "學術文獻", "PubMed", "研究追蹤"
  ],
  authors: [{ name: "聽語期刊速報", url: "https://audslp.vercel.app" }],
  creator: "聽語期刊速報",
  publisher: "聽語期刊速報",
  metadataBase: new URL("https://audslp.vercel.app"),
  alternates: {
    canonical: "https://audslp.vercel.app",
    languages: {
      "zh-TW": "https://audslp.vercel.app",
      "zh-CN": "https://audslp.vercel.app",
      "en": "https://audslp.vercel.app"
    }
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://audslp.vercel.app",
    siteName: "聽語期刊速報",
    title: "聽語期刊速報 | 聽力學與語言治療期刊推播網站",
    description: "專業的聽力學與語言治療期刊推播網站，提供最新的學術研究、AI 智能推薦、跨期刊文章搜尋和研究趨勢追蹤。",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "聽語期刊速報 - 專業期刊推播網站"
    }]
  },
  twitter: {
    card: "summary_large_image",
    site: "@audslp",
    title: "聽語期刊速報 | 聽力學與語言治療期刊推播網站",
    description: "專業的聽力學與語言治療期刊推播網站，提供最新的學術研究、AI 智能推薦、跨期刊文章搜尋。",
    images: ["/og-image.png"]
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    // bing: "your-bing-verification-code",
  },
  category: "醫學研究",
  classification: "學術資源"
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
        <Analytics />
      </body>
    </html>
  )
}
