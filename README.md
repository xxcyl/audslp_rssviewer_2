# 聽語期刊速報 (AudSLP RSS Viewer 2.0)

> 專業的聽力學與語言治療期刊推播網站

## 📋 專案基本資訊

| 項目 | 內容 |
|------|------|
| **專案名稱** | audslp_rssviewer_2 |
| **網站名稱** | 聽語期刊速報 |
| **定位** | 聽力學和語言治療的期刊推播網站 |
| **目標** | 成為 Google 搜尋首頁的專業資源網站 |
| **部署平台** | Vercel |
| **預計 URL** | https://audslp-rssviewer-2.vercel.app |

## 🛠 技術架構

### 核心技術棧
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Tailwind CSS + shadcn/ui
- **Database**: Supabase
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4

### 相依套件清單
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "^1.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "lucide-react": "^0.263.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

## 📁 專案結構

```
audslp_rssviewer_2/
├── .next/                      # Next.js 建置檔案
├── .vscode/                    # VS Code 設定
├── public/                     # 靜態檔案
│   ├── favicon.ico
│   ├── og-image.png
│   └── robots.txt
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── articles/
│   │   │   └── likes/
│   │   ├── article/[id]/      # 文章詳情頁
│   │   ├── category/[slug]/   # 分類頁面
│   │   ├── sitemap.xml/       # 動態網站地圖
│   │   ├── robots.txt/        # 爬蟲規則
│   │   ├── rss.xml/          # RSS 訂閱
│   │   ├── globals.css        # 全域樣式
│   │   ├── layout.tsx         # 根布局
│   │   ├── loading.tsx        # 載入頁面
│   │   ├── error.tsx          # 錯誤頁面
│   │   └── page.tsx           # 首頁
│   ├── components/            # React 組件
│   │   ├── ui/               # shadcn/ui 基礎組件
│   │   ├── seo/              # SEO 相關組件
│   │   ├── social/           # 社群功能組件
│   │   ├── articles/         # 文章相關組件
│   │   ├── layout/           # 版面組件
│   │   └── recommendations/   # 推薦系統組件
│   ├── lib/                  # 工具函數
│   │   ├── supabase.ts       # Supabase 客戶端
│   │   ├── types.ts          # TypeScript 類型定義
│   │   ├── utils.ts          # 通用工具函數
│   │   ├── likes.ts          # 按讚功能邏輯
│   │   └── validations.ts    # 資料驗證 schemas
│   ├── hooks/                # 自定義 React Hooks
│   │   ├── useArticles.ts    # 文章資料邏輯
│   │   ├── useLikes.ts       # 按讚功能
│   │   └── useRecommendations.ts # 推薦系統
│   └── store/               # Zustand 狀態管理
│       └── articles.ts       # 文章狀態
├── .env.local               # 環境變數 (不會被版控)
├── .env.example             # 環境變數範例
├── .gitignore               # Git 忽略檔案
├── components.json          # shadcn/ui 設定
├── next.config.js           # Next.js 設定
├── package.json             # 專案相依性
├── tailwind.config.js       # Tailwind 設定
├── tsconfig.json            # TypeScript 設定
└── README.md               # 專案說明文件
```

## 🗄 資料庫架構

### Supabase 資料表

#### 現有資料表: `rss_entries`
```sql
-- 需要新增的欄位
ALTER TABLE rss_entries ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
```

#### 新增資料表: `article_likes`
```sql
CREATE TABLE IF NOT EXISTS article_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id INTEGER NOT NULL REFERENCES rss_entries(id) ON DELETE CASCADE,
  user_fingerprint TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_fingerprint)
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_created_at ON article_likes(created_at);
CREATE INDEX IF NOT EXISTS idx_article_likes_fingerprint ON article_likes(user_fingerprint);
```

#### RPC 函數
```sql
-- 增加讚數
CREATE OR REPLACE FUNCTION increment_likes(article_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE rss_entries 
  SET likes_count = likes_count + 1 
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 減少讚數
CREATE OR REPLACE FUNCTION decrement_likes(article_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE rss_entries 
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 取得相似文章（如果已存在向量搜尋功能）
CREATE OR REPLACE FUNCTION get_similar_articles(
  target_article_id INTEGER,
  similarity_threshold FLOAT DEFAULT 0.6,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  title_translated TEXT,
  tldr TEXT,
  english_tldr TEXT,
  source TEXT,
  published TIMESTAMP,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.title_translated,
    r.tldr,
    r.english_tldr,
    r.source,
    r.published,
    (1 - (target.embedding <=> r.embedding)) AS similarity
  FROM rss_entries r
  CROSS JOIN (SELECT embedding FROM rss_entries WHERE id = target_article_id) target
  WHERE r.id != target_article_id
    AND r.embedding IS NOT NULL
    AND (1 - (target.embedding <=> r.embedding)) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🎨 設計系統

### 色彩配置
```css
:root {
  /* 主色調 - 基於原始設計的紫色漸層 */
  --primary-start: #667eea;
  --primary-end: #764ba2;
  --primary: #667eea;
  --primary-foreground: #ffffff;
  
  /* 輔助色彩 */
  --secondary: #f8f9fa;
  --secondary-foreground: #495057;
  
  /* 功能色彩 */
  --success: #28a745;
  --warning: #ffc107;
  --error: #dc3545;
  --info: #17a2b8;
  
  /* 按讚功能色彩 */
  --like-color: #e53e3e;
  --like-bg: #fed7d7;
  
  /* 背景色彩 */
  --background: #ffffff;
  --card-background: #ffffff;
  --muted: #f8f9fa;
}
```

### 字體系統
```css
.font-system {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
}

/* 中文字體優化 */
.font-chinese {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               'PingFang TC', 'Microsoft JhengHei', '微軟正黑體', sans-serif;
}
```

## 🚀 開發階段規劃

### Phase 1: 基礎架構設定 (目標: 1-2 週)
- [ ] Next.js 14 專案初始化
- [ ] TypeScript 設定
- [ ] Tailwind CSS + shadcn/ui 安裝設定
- [ ] Supabase 客戶端設定
- [ ] 基本專案結構建立
- [ ] Git repository 建立

**完成標準**: 能夠成功連接 Supabase 並顯示基本頁面

### Phase 2: 核心功能開發 (目標: 2-3 週)
- [ ] 文章列表組件開發
- [ ] 分頁功能實作
- [ ] 篩選與排序功能
- [ ] 文章詳情頁面
- [ ] 按讚功能完整實作
- [ ] 向量相似度推薦系統
- [ ] 響應式設計實作

**完成標準**: 所有核心功能運作正常，手機版體驗良好

### Phase 3: SEO 與社群功能 (目標: 1-2 週)
- [ ] SEO meta 標籤動態生成
- [ ] 結構化資料 (Schema.org)
- [ ] 社群分享按鈕
- [ ] sitemap.xml 自動生成
- [ ] robots.txt 設定
- [ ] RSS 訂閱功能
- [ ] Google Analytics 整合

**完成標準**: SEO 工具檢測通過，社群分享功能正常

### Phase 4: 部署與優化 (目標: 1 週)
- [ ] Vercel 部署設定
- [ ] 環境變數設定
- [ ] 效能優化 (圖片、字體、bundle)
- [ ] 錯誤處理完善
- [ ] 使用者體驗測試
- [ ] Google Search Console 設定

**完成標準**: 網站成功上線，Lighthouse 分數 > 90

### Phase 5: 未來功能開發 (待排程)
- [ ] 留言系統設計與實作
- [ ] 進階數據分析面板
- [ ] PWA 功能
- [ ] 推播通知
- [ ] 多語言支援 (如需要)

## 🔧 開發環境設定

### 環境變數設定
```bash
# .env.local (需要手動建立，不會被 git 追蹤)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://audslp-rssviewer-2.vercel.app
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 開發指令
```bash
# 安裝相依性
npm install

# 開發伺服器
npm run dev

# 建置專案
npm run build

# 啟動產品模式
npm start

# 程式碼檢查
npm run lint

# 類型檢查
npm run type-check
```

## 📊 品質標準

### 效能指標
- **Lighthouse Performance**: > 90
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### SEO 指標
- **Lighthouse SEO**: > 95
- **Meta 標籤完整度**: 100%
- **結構化資料**: 無錯誤
- **手機適配性**: 通過

### 無障礙指標
- **Lighthouse Accessibility**: > 90
- **WCAG 2.1 AA**: 符合
- **鍵盤導航**: 支援
- **螢幕閱讀器**: 友善

## 🐛 問題追蹤

### 已知問題
- [ ] 無

### 待討論事項
- [ ] 是否需要深色模式支援？
- [ ] 是否需要多語言版本？
- [ ] Logo 和品牌視覺設計
- [ ] 域名選擇
- [ ] 開發環境設定確認
- [ ] Git repository 建立

## 📝 更新紀錄

### v2.0.0 (規劃中)
- 重新設計的 UI/UX
- Next.js 14 App Router
- 改善的 SEO 優化
- 新增按讚功能
- 社群分享整合

---

**最後更新**: 2025年8月8日  
**維護者**: Claude & 開發團隊  
**授權**: MIT License
