'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  className?: string
}

const PAGE_SIZE_OPTIONS = [
  { value: 12, label: '12 篇' },
  { value: 24, label: '24 篇' },
  { value: 48, label: '48 篇' },
  { value: 96, label: '96 篇' },
] as const

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
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

  const handlePageSizeChange = (value: string) => {
    if (onPageSizeChange) {
      const newPageSize = parseInt(value, 10)
      onPageSizeChange(newPageSize)
    }
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-200",
      className
    )}>
      
      {/* 左側：每頁顯示數量 */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>每頁顯示</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 中間：分頁資訊 */}
      <div className="flex items-center gap-6">
        
        {/* 顯示範圍資訊 */}
        <div className="text-sm text-gray-600">
          顯示 {startItem.toLocaleString()} - {endItem.toLocaleString()} 項，
          共 {totalItems.toLocaleString()} 項
        </div>

        {/* 分頁按鈕 */}
        <div className="flex items-center gap-1">
          
          {/* 第一頁 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
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
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* 頁碼 */}
          <div className="flex items-center gap-1">
            {getPageRange().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
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
                    "h-8 w-8 p-0",
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
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 右側：快速跳頁 */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>跳至第</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          defaultValue={currentPage}
          className="w-16 h-8 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  )
}