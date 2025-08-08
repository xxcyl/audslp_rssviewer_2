 * @throws {AppError} 當文章不存在或查詢失敗時
 * @example
 * ```typescript
 * const result = await getLikeStatus(123, 'abc123def')
 * console.log(result.isLiked) // true | false
 * console.log(result.totalLikes) // number
 * ```
 */
export async function getLikeStatus(
  articleId: number, 
  userFingerprint: string
): Promise<{ isLiked: boolean; totalLikes: number }> {
  // 實作內容...
}
```

### README 格式
```markdown
# 組件名稱

> 簡短描述組件功能

## 功能特色
- ✅ 特色一
- ✅ 特色二

## 使用方式
\`\`\`tsx
import { ComponentName } from '@/components/ComponentName'

<ComponentName prop1="value1" prop2="value2" />
\`\`\`

## API 參考
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| prop1 | string | - | 屬性說明 |

## 範例
詳細使用範例...
```

## 🛠 開發工具設定

### VS Code 設定 (.vscode/settings.json)
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### ESLint 規則 (.eslintrc.json)
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

## 📱 使用者體驗指南

### 載入狀態設計
```typescript
// 統一的載入狀態組件
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
  )
}

// 骨架屏載入
export function ArticleCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-20 bg-gray-200 rounded mb-4"></div>
    </div>
  )
}
```

### 錯誤狀態處理
```typescript
// 統一的錯誤顯示組件
interface ErrorDisplayProps {
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function ErrorDisplay({ title = '發生錯誤', message, action }: ErrorDisplayProps) {
  return (
    <div className="text-center py-12">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
```

### 空狀態設計
```typescript
export function EmptyState({ 
  icon = '📭', 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {action && (
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {action.label}
        </button>
      )}
    </div>
  )
}
```

## 🔍 除錯指南

### 常見問題排解

#### 1. Supabase 連線問題
```typescript
// 檢查連線狀態
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('rss_entries')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    console.log('Supabase connection OK')
    return true
  } catch (err) {
    console.error('Connection check failed:', err)
    return false
  }
}
```

#### 2. 環境變數檢查
```typescript
// 開發模式下的環境變數檢查
if (process.env.NODE_ENV === 'development') {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      console.error(`❌ 缺少環境變數: ${varName}`)
    } else {
      console.log(`✅ 環境變數已設定: ${varName}`)
    }
  })
}
```

### 除錯工具設定
```typescript
// lib/debug.ts
export const DEBUG = process.env.NODE_ENV === 'development'

export function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(`🐛 [DEBUG] ${message}`, data || '')
  }
}

export function debugError(message: string, error?: any) {
  if (DEBUG) {
    console.error(`❌ [ERROR] ${message}`, error || '')
  }
}

export function debugPerformance(label: string, fn: () => any) {
  if (DEBUG) {
    console.time(label)
    const result = fn()
    console.timeEnd(label)
    return result
  }
  return fn()
}
```

## 📊 監控與分析

### 效能監控
```typescript
// lib/analytics.ts
export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: path,
    })
  }
}

export function trackEvent(action: string, params?: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

// 使用範例
trackEvent('article_view', {
  article_id: 123,
  article_title: '文章標題',
  source: '期刊名稱'
})
```

### 錯誤監控
```typescript
// lib/errorTracking.ts
export function trackError(error: Error, context?: any) {
  // 開發環境直接 log
  if (process.env.NODE_ENV === 'development') {
    console.error('Error tracked:', error, context)
    return
  }
  
  // 生產環境可以整合 Sentry 等服務
  // Sentry.captureException(error, { extra: context })
}

// React Error Boundary
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    trackError(error, { boundary: 'React Error Boundary' })
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay message="頁面載入發生錯誤，請重新整理頁面" />
    }

    return this.props.children
  }
}
```

## 🚀 部署檢核清單

### 部署前檢查
- [ ] 所有環境變數已設定
- [ ] 程式碼通過 TypeScript 檢查
- [ ] 程式碼通過 ESLint 檢查
- [ ] 單元測試通過
- [ ] 建置成功無錯誤
- [ ] Lighthouse 分數檢查
- [ ] 手機版體驗測試
- [ ] 瀏覽器相容性測試

### 上線後檢查
- [ ] 網站正常載入
- [ ] Supabase 連線正常
- [ ] 分頁功能正常
- [ ] 按讚功能正常
- [ ] 社群分享功能正常
- [ ] Google Analytics 追蹤正常
- [ ] SEO meta 標籤正確
- [ ] sitemap 可存取
- [ ] robots.txt 設定正確

## 📞 支援與維護

### 緊急問題處理流程
1. **評估影響範圍** - 是否影響全站還是特定功能
2. **快速修復** - 優先恢復服務
3. **根本原因分析** - 找出問題源頭
4. **預防措施** - 避免同類問題再次發生
5. **文件更新** - 記錄問題和解決方案

### 定期維護工作
- **每週**: 檢查 Vercel 部署狀態、Supabase 用量
- **每月**: 更新套件、安全性檢查、效能分析
- **每季**: 程式碼重構、技術債務處理

---

**文件版本**: v1.0.0  
**建立日期**: 2025年8月8日  
**最後更新**: 2025年8月8日
