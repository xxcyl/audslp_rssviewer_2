'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('應用程式錯誤:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* 錯誤圖示 */}
        <div className="text-6xl mb-6">⚠️</div>
        
        {/* 錯誤標題 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          發生錯誤了
        </h1>
        
        {/* 錯誤描述 */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          很抱歉，應用程式遇到了一些問題。這可能是暫時性的問題，請嘗試重新載入頁面。
        </p>
        
        {/* 錯誤詳情（僅在開發環境顯示） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-red-800 mb-2">錯誤詳情：</h3>
            <p className="text-sm text-red-700 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
        
        {/* 操作按鈕 */}
        <div className="space-y-4">
          <Button 
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            🔄 重新載入
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            🏠 回到首頁
          </Button>
        </div>
        
        {/* 聯絡資訊 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            如果問題持續存在，請重新整理頁面或檢查網路連線
          </p>
        </div>
      </div>
    </div>
  )
}