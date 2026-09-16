'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
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
    <div className={cn("border-t border-[var(--brand-border)] pt-8 pb-2 flex flex-col items-center gap-2.5", className)}>
      <div className="flex items-center gap-5 text-sm">
        {/* 上一頁 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center gap-1 transition-colors",
            currentPage === 1
              ? "text-[var(--brand-border)] cursor-not-allowed"
              : "text-[var(--brand-primary)] hover:text-[var(--brand-accent)]"
          )}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          上一頁
        </button>

        {/* 頁碼 */}
        <div className="flex items-center gap-4">
          {getPageRange().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="text-[var(--brand-border)]">
                  ···
                </span>
              )
            }

            const pageNum = page as number
            const isCurrentPage = pageNum === currentPage

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "transition-colors",
                  isCurrentPage
                    ? "font-bold text-[var(--brand-primary)] border-b-2 border-[var(--brand-accent)] pb-0.5"
                    : "text-[var(--brand-text-faint)] hover:text-[var(--brand-primary)]"
                )}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        {/* 下一頁 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center gap-1 transition-colors",
            currentPage === totalPages
              ? "text-[var(--brand-border)] cursor-not-allowed"
              : "text-[var(--brand-primary)] hover:text-[var(--brand-accent)]"
          )}
        >
          下一頁
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 統計資訊 */}
      <div className="text-xs text-[var(--brand-text-faint)]">
        共 {totalItems.toLocaleString()} 篇文章　·　第 {currentPage} / {totalPages} 頁
      </div>
    </div>
  )
}
