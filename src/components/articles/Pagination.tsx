'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className
}: PaginationProps) {
  
  if (totalPages <= 1) return null

  // 生成頁碼範圍
  const getPageRange = () => {
    const delta = 2 // 當前頁面前後顯示的頁數
    const rangeStart = Math.max(1, currentPage - delta)
    const rangeEnd = Math.min(totalPages, currentPage + delta)
    
    const pages: (number | string)[] = []
    
    // 添加第一頁和省略號
    if (rangeStart > 1) {
      pages.push(1)
      if (rangeStart > 2) {
        pages.push('...')
      }
    }
    
    // 添加當前範圍的頁面
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }
    
    // 添加省略號和最後一頁
    if (rangeEnd < totalPages) {
      if (rangeEnd < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }
    
    return pages
  }

  return (
    <div className={cn("bg-white border-t border-gray-200", className)}>
      
      {/* 分頁按鈕 */}
      <div className="flex items-center justify-center gap-1 px-6 py-4">
        
        {/* 第一頁 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
          title="第一頁"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* 上一頁 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
          title="上一頁"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* 頁碼 */}
        <div className="flex items-center gap-1 mx-2">
          {getPageRange().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400 text-sm">
                  ...
                </span>
              )
            }
            
            const pageNum = page as number
            const isCurrentPage = pageNum === currentPage
            
            return (
              <Button
                key={pageNum}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "h-8 w-8 p-0 text-sm",
                  isCurrentPage && "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        {/* 下一頁 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
          title="下一頁"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* 最後一頁 */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
          title="最後一頁"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>

        {/* 快速跳頁 */}
        <div className="flex items-center gap-2 ml-4 text-sm text-gray-600">
          <span>跳至</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            defaultValue={currentPage}
            className="w-14 h-8 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = parseInt(e.currentTarget.value, 10)
                if (value >= 1 && value <= totalPages) {
                  onPageChange(value)
                }
              }
            }}
          />
          <span>頁</span>
        </div>
      </div>

      {/* 統計資訊列 - 新增的第二行 */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600 text-center">
          共 <span className="font-medium text-gray-900">{totalItems.toLocaleString()}</span> 篇文章 
          • 第 <span className="font-medium text-gray-900">{currentPage}</span> / <span className="font-medium text-gray-900">{totalPages}</span> 頁
        </div>
      </div>
    </div>
  )
}