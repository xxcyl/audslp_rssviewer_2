# Next.js 專案建立指令

在終端機中執行以下指令來建立 Next.js 專案：

```bash
# 進入專案目錄
cd /Users/leecheyu/Desktop/MCP_files/audslp_rssviewer_2

# 使用 create-next-app 建立專案
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 安裝額外的套件
npm install @supabase/supabase-js @tanstack/react-query zustand react-hook-form zod lucide-react class-variance-authority clsx tailwind-merge

# 安裝 shadcn/ui
npx shadcn-ui@latest init

# 安裝常用的 shadcn/ui 組件
npx shadcn-ui@latest add button card input label select textarea dialog sheet modal dropdown-menu

# 安裝開發相關套件
npm install -D @types/node

# 建立基本的資料夾結構
mkdir -p src/lib src/hooks src/store src/components/ui src/components/articles src/components/layout src/components/seo src/components/social src/components/recommendations

# 複製環境變數範例
cp .env.example .env.local

# 初始化 Git
git init
git add .
git commit -m "Initial commit: Next.js 14 project with TypeScript and Tailwind CSS"
```

## 注意事項

1. **確保已安裝 Node.js 18+ 版本**
2. **記得在 .env.local 中填入正確的 Supabase 連線資訊**
3. **第一次運行前請執行 `npm run dev` 測試是否正常**
4. **建議建立 GitHub Repository 並推送程式碼**

## 下一步

1. 檢查 `src/app/page.tsx` 是否正常顯示
2. 測試 Supabase 連線
3. 開始開發第一個組件
