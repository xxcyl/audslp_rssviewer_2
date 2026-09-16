'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AlertTriangle, BookOpen, SearchX } from 'lucide-react'
import { FilterToolbar } from '@/components/articles/FilterToolbar'
import { ArticleGrid } from '@/components/articles/ArticleGrid'
import { Pagination } from '@/components/articles/Pagination'
import { RecommendationModal } from '@/components/recommendations/RecommendationModal'
import { HomePageJsonLd } from '@/components/seo/JsonLd'
import { SiteShareButtons } from '@/components/social/ShareButtons'
import { useArticles } from '@/hooks/useArticles'
import { useBatchLikes } from '@/hooks/useLikes'
import type { FilterOptions, Article } from '@/lib/types'

// 建立 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分鐘
      gcTime: 10 * 60 * 1000, // 10 分鐘
    },
  },
})

// 主頁面組件（包含 QueryClient Provider）
export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout />
    </QueryClientProvider>
  )
}

// 主要布局組件
function MainLayout() {
  // 全局狀態管理
  const [globalSearchQuery, setGlobalSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  // const [pageSize, setPageSize] = useState(12) // 未使用，暫時註解
  const pageSize = 12
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'created_at.desc'
  })
  
  // 推薦功能狀態
  const [recommendationModal, setRecommendationModal] = useState({
    isOpen: false,
    sourceArticle: null as Article | null
  })

  // 獲取文章資料
  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: articlesError,
    refetch: refetchArticles
  } = useArticles({
    page: currentPage,
    pageSize,
    filters
  })

  // 獲取批量按讚狀態
  const articleIds = articlesData?.articles.map(article => article.id) || []
  const { data: likedArticles = new Set() } = useBatchLikes(articleIds)
  
  // 使用 likedArticles 來顯示按讚狀態（目前先保留備用）
  console.log('Current liked articles:', likedArticles.size)

  // 處理篩選功能
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1) // 重置到第一頁
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 滾動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRefresh = () => {
    refetchArticles()
  }

  // 處理按讚功能
  const handleLike = async (articleId: number) => {
    console.log('按讚文章:', articleId)
    // 這裡會觸發重新載入來更新按讚狀態
    // 當按讚 hook 完整實作後，這裡會自動更新
    setTimeout(() => {
      refetchArticles()
    }, 500)
  }

  const handleRecommend = (articleId: number) => {
    const article = articlesData?.articles.find(a => a.id === articleId)
    if (article) {
      setRecommendationModal({
        isOpen: true,
        sourceArticle: article
      })
    }
  }
  
  const handleCloseRecommendation = () => {
    setRecommendationModal({
      isOpen: false,
      sourceArticle: null
    })
  }
  
  const handleRecommendedArticleClick = (article: Article) => {
    console.log('查看推薦文章:', article.title_translated || article.title)
    // 這裡可以導航到文章詳情頁面或開啟新的 modal
  }

  // 處理標題欄搜尋 - 只在按下 Enter 時觸發
  const handleHeaderSearch = () => {
    const newFilters = {
      ...filters,
      searchQuery: globalSearchQuery || undefined
    }
    setFilters(newFilters)
    setCurrentPage(1)
  }

  if (articlesError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-purple-800 py-4">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-white">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                  聽語期刊速報
                </h1>
                <span className="hidden md:inline-block text-purple-200 text-sm">
                  專業期刊推播
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    placeholder="搜尋關鍵字"
                    className="w-48 md:w-64 px-4 py-2 pr-10 bg-purple-700 text-white placeholder-purple-300 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleHeaderSearch()
                      }
                    }}
                  />

                  {/* 搜尋圖示或清除按鈕 */}
                  {globalSearchQuery ? (
                    <button
                      onClick={() => {
                        setGlobalSearchQuery('')
                        // 清除搜尋條件
                        const newFilters = {
                          ...filters,
                          searchQuery: undefined
                        }
                        setFilters(newFilters)
                        setCurrentPage(1)
                      }}
                      className="absolute right-3 top-2.5 h-5 w-5 text-purple-300 hover:text-white transition-colors"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <svg className="absolute right-3 top-2.5 h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">載入文章時發生錯誤</h3>
            <p className="text-gray-600 mb-4 text-center max-w-md">
              {articlesError.message || '無法連接到資料庫，請檢查網路連線或稍後再試'}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              重新載入
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil((articlesData?.totalCount || 0) / pageSize)
  const isSearching = !!filters.searchQuery

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO 結構化資料 */}
      <HomePageJsonLd />
      
      {/* 現代化頂部導航欄 */}
      <header className="bg-purple-800 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* 左側 Logo/標題 */}
            <div className="flex items-center space-x-3">
              <h1 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-white">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                聽語期刊速報
              </h1>
              <span className="hidden md:inline-block text-purple-200 text-sm">
                專業期刊推播
              </span>
            </div>
            
            {/* 右側搜尋框 */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  placeholder="搜尋關鍵字"
                  className="w-48 md:w-64 px-4 py-2 pr-10 bg-purple-700 text-white placeholder-purple-300 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleHeaderSearch()
                    }
                  }}
                />
                
                {/* 搜尋圖示或清除按鈕 */}
                {globalSearchQuery ? (
                  <button
                    onClick={() => {
                      setGlobalSearchQuery('')
                      // 清除搜尋條件
                      const newFilters = {
                        ...filters,
                        searchQuery: undefined
                      }
                      setFilters(newFilters)
                      setCurrentPage(1)
                    }}
                    className="absolute right-3 top-2.5 h-5 w-5 text-purple-300 hover:text-white transition-colors"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <svg className="absolute right-3 top-2.5 h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="space-y-6">
          {/* 搜尋和篩選工具列 - 簡化版 */}
          <FilterToolbar
            sources={articlesData?.sources || []}
            currentFilters={filters}
            onFiltersChange={handleFiltersChange}
            totalCount={articlesData?.totalCount || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            onRefresh={handleRefresh}
            isLoading={articlesLoading}
            hideSearchBox={true}
          />

          {/* 無搜尋結果提示 */}
          {isSearching && !articlesLoading && articlesData?.articles.length === 0 && (
            <div className="text-center py-12">
              <SearchX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">找不到相關文章</h3>
              <p className="text-gray-600 mb-4">
                沒有找到包含 &ldquo;<span className="font-medium text-blue-600">{filters.searchQuery}</span>&rdquo; 的文章
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>建議您：</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>檢查拼字是否正確</li>
                  <li>嘗試使用不同的關鍵字</li>
                  <li>使用更廣泛的搜尋詞</li>
                  <li>清除來源篩選條件</li>
                </ul>
              </div>
            </div>
          )}

          {/* 文章網格 */}
          <ArticleGrid
            articles={articlesData?.articles || []}
            onLike={handleLike}
            onRecommend={handleRecommend}
            isLoading={articlesLoading}
            searchTerm={filters.searchQuery} // 新增：傳遞搜尋詞用於高亮
          />

          {/* 分頁 */}
          {!articlesLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={articlesData?.totalCount || 0}
              onPageChange={handlePageChange}
            />
          )}
          
          {/* 推薦文章 Modal */}
          <RecommendationModal
            isOpen={recommendationModal.isOpen}
            onClose={handleCloseRecommendation}
            sourceArticle={recommendationModal.sourceArticle}
            onArticleClick={handleRecommendedArticleClick}
          />
        </div>
      </div>

      {/* 頁腳 */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-6">
          {/* AI 警告聲明 - 簡化版 */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-6">
            <p className="flex items-start gap-2 text-sm text-amber-800">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <span className="font-medium">提醒：</span>
                AI 生成的摘要和翻譯僅供參考，請以 PubMed 原文為準。
              </span>
            </p>
          </div>
          
          {/* 分享功能 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-sm text-gray-600">
              喜歡這個網站嗎？分享給其他專業人員吧！
            </div>
            <SiteShareButtons className="shrink-0" />
          </div>
          
          {/* 版權資訊 */}
          <div className="text-center text-gray-600 border-t pt-6">
            <p>&copy; 2025 聽語期刊速報. 專為聽力學與語言治療專業人員設計</p>
            <p className="text-sm mt-2">
              建置於 Next.js 15, Supabase, Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
