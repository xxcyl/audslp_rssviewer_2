'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FilterToolbar } from '@/components/articles/FilterToolbar'
import { ArticleGrid } from '@/components/articles/ArticleGrid'
import { Pagination } from '@/components/articles/Pagination'
import { RecommendationModal } from '@/components/recommendations/RecommendationModal'
import { useArticles } from '@/hooks/useArticles'
import { useBatchLikes } from '@/hooks/useLikes'
import type { FilterOptions, Article } from '@/lib/types'
import { BookOpen, Heart, TrendingUp, Users, Search } from 'lucide-react'

// 建立 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分鐘
      gcTime: 10 * 60 * 1000, // 10 分鐘
    },
  },
})

// 緊湊統計卡片組件
function CompactStatsCard({ icon: Icon, title, value, color }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string | number
  color: string
}) {
  return (
    <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} shrink-0`}>
          <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-lg md:text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

// 載入狀態組件
function CompactLoadingStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-lg shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="h-3 bg-gray-200 rounded w-12 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 主要內容組件
function ArticlesContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(24)
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'published.desc'
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

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1) // 重置到第一頁
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // 滾動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // 重置到第一頁
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

  if (articlesError) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
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
    )
  }

  const totalPages = Math.ceil((articlesData?.totalCount || 0) / pageSize)
  const isSearching = !!filters.searchQuery

  return (
    <div className="space-y-6">
      {/* 統計資訊 - 搜尋時顯示不同的統計 */}
      {articlesLoading ? (
        <CompactLoadingStats />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <CompactStatsCard
            icon={isSearching ? Search : BookOpen}
            title={isSearching ? "搜尋結果" : "總文章數"}
            value={articlesData?.totalCount?.toLocaleString() || 0}
            color={isSearching ? "bg-orange-500" : "bg-blue-500"}
          />
          <CompactStatsCard
            icon={Users}
            title="期刊來源"
            value={articlesData?.sources?.length || 0}
            color="bg-green-500"
          />
          <CompactStatsCard
            icon={Heart}
            title="本頁按讚"
            value={articlesData?.articles?.reduce((sum, article) => sum + (article.likes_count || 0), 0) || 0}
            color="bg-red-500"
          />
          <CompactStatsCard
            icon={TrendingUp}
            title={`第 ${currentPage}/${totalPages} 頁`}
            value={`${pageSize} 篇`}
            color="bg-purple-500"
          />
        </div>
      )}

      {/* 搜尋和篩選工具列 */}
      <FilterToolbar
        sources={articlesData?.sources || []}
        currentFilters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={articlesData?.totalCount || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onRefresh={handleRefresh}
        isLoading={articlesLoading}
      />

      {/* 無搜尋結果提示 */}
      {isSearching && !articlesLoading && articlesData?.articles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
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
          pageSize={pageSize}
          totalItems={articlesData?.totalCount || 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
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
  )
}

// 主頁面組件（包含 QueryClient Provider）
export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {/* 頁面標題 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 md:py-8">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              📚 聽語期刊速報
            </h1>
            <p className="text-sm md:text-base lg:text-lg opacity-90 max-w-2xl mx-auto">
              專業的聽力學與語言治療期刊推播網站
            </p>
            <p className="text-xs md:text-sm opacity-75 mt-1 hidden md:block">
              瀏覽最新的學術研究，發現相關文章，追蹤研究趨勢
            </p>
          </div>
        </div>

        {/* 主要內容 */}
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
          <ArticlesContent />
        </div>

        {/* 頁腳 */}
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="container mx-auto px-6 text-center text-gray-600">
            <p>&copy; 2025 聽語期刊速報. 專為聽力學與語言治療專業人員設計</p>
            <p className="text-sm mt-2">
              建置於 Next.js 15, Supabase, Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  )
}
