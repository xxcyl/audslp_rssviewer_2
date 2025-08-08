export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題區域載入中 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-96 mx-auto mb-2"></div>
            <div className="h-5 bg-white/20 rounded w-80 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* 主要內容載入中 */}
      <div className="container mx-auto px-6 py-8">
        
        {/* 統計卡片載入中 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 篩選工具列載入中 */}
        <div className="bg-white border border-gray-200 px-6 py-4 shadow-sm animate-pulse mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-9 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-9 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* 文章網格載入中 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="h-6 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>

        {/* 分頁載入中 */}
        <div className="flex justify-center items-center gap-4 px-6 py-4 bg-white border-t border-gray-200 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-4"></div>
          </div>
        </div>
      </div>
      
      {/* 載入中的中心指示器 */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">載入中...</h3>
          <p className="text-sm text-gray-600 text-center">
            正在載入文章資料，請稍候
          </p>
        </div>
      </div>
    </div>
  )
}