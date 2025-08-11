'use client'

import { RefreshCw, Filter, Search, X, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { SearchHighlight } from '@/components/articles/SearchBar'
import type { FilterOptions } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface FilterToolbarProps {
  sources: string[]
  currentFilters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  totalCount: number
  currentPage: number
  pageSize: number
  onPageSizeChange?: (pageSize: number) => void
  onRefresh?: () => void
  isLoading?: boolean
  className?: string
}

const SORT_OPTIONS = [
  { value: 'published.desc', label: '最新發布' },
  { value: 'published.asc', label: '最舊發布' },
  { value: 'created_at.desc', label: '最新收錄' },
  { value: 'likes_count.desc', label: '最多按讚' },
  { value: 'title', label: '標題排序' },
] as const

const PAGE_SIZE_OPTIONS = [
  { value: 12, label: '12' },
  { value: 24, label: '24' },
  { value: 48, label: '48' },
  { value: 96, label: '96' },
] as const

export function FilterToolbar({
  sources,
  currentFilters,
  onFiltersChange,
  totalCount,
  currentPage,
  pageSize,
  onPageSizeChange,
  onRefresh,
  isLoading = false,
  className
}: FilterToolbarProps) {
  
  const [searchValue, setSearchValue] = useState(currentFilters.searchQuery || '')

  // 同步外部搜尋值
  useEffect(() => {
    setSearchValue(currentFilters.searchQuery || '')
  }, [currentFilters.searchQuery])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleSearchSubmit = () => {
    onFiltersChange({
      ...currentFilters,
      searchQuery: searchValue || undefined
    })
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearchSubmit()
    }
    if (e.key === 'Escape') {
      setSearchValue('')
      onFiltersChange({
        ...currentFilters,
        searchQuery: undefined
      })
    }
  }

  const handleSearchClear = () => {
    setSearchValue('')
    onFiltersChange({
      ...currentFilters,
      searchQuery: undefined
    })
  }

  const handleSourceChange = (source: string) => {
    onFiltersChange({
      ...currentFilters,
      source: source === 'all' ? undefined : source
    })
  }

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFiltersChange({
      ...currentFilters,
      sortBy
    })
  }

  const handlePageSizeChange = (value: string) => {
    if (onPageSizeChange) {
      const newPageSize = parseInt(value, 10)
      onPageSizeChange(newPageSize)
    }
  }

  const isSearching = !!currentFilters.searchQuery
  const hasActiveFilters = !!currentFilters.source || !!currentFilters.searchQuery
  const hasUnsubmittedSearch = searchValue !== (currentFilters.searchQuery || '')
  const totalPages = Math.ceil(totalCount / pageSize)

  // 生成統計文字
  const getStatsText = () => {
    let text = `${totalCount.toLocaleString()} 篇`
    
    if (hasActiveFilters) {
      text += ' • 已篩選'
    }
    
    if (totalPages > 1) {
      text += ` • 第 ${currentPage}/${totalPages} 頁`
    }
    
    return text
  }

  return (
    <div className={cn("bg-white border-b border-gray-200", className)}>
      
      {/* 主工具列 - 左右分佈式設計 */}
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* 左側：來源篩選 + 搜尋框 */}
          <div className="flex items-center gap-3 flex-1">
            {/* 來源篩選 - 純圖示，無下拉箭頭 */}
            <Select
              value={currentFilters.source || 'all'}
              onValueChange={handleSourceChange}
              disabled={isLoading}
            >
              <SelectTrigger className={cn(
                "w-[40px] h-9 p-0 border-gray-300 [&>svg]:hidden", // 隱藏預設的下拉箭頭
                currentFilters.source && "border-blue-400 bg-blue-50 text-blue-700"
              )}>
                <Filter className="w-4 h-4 mx-auto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有來源</SelectItem>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 搜尋框 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="搜尋關鍵字"
                  disabled={isLoading}
                  className={cn(
                    "pl-10 pr-10 h-9 border-gray-300",
                    "focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
                    hasUnsubmittedSearch && "border-blue-300"
                  )}
                />
                
                {/* 清除按鈕 */}
                {searchValue && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSearchClear}
                    disabled={isLoading}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 右側：排序 + 文章數 + 重新載入 */}
          <div className="flex items-center gap-3">
            
            {/* 排序方式 - 純圖示，無下拉箭頭 */}
            <Select
              value={currentFilters.sortBy}
              onValueChange={handleSortChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[40px] h-9 p-0 border-gray-300 [&>svg]:hidden">
                <ArrowUpDown className="w-4 h-4 mx-auto" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 每頁顯示數量 - 純數字，無下拉箭頭 */}
            {onPageSizeChange && (
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[45px] h-9 p-0 border-gray-300 text-sm [&>svg]:hidden">
                  <div className="w-full text-center">
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* 重新載入按鈕 */}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-9 w-9 p-0"
                title="重新載入"
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              </Button>
            )}
          </div>
        </div>

        {/* 搜尋提示 */}
        {hasUnsubmittedSearch && (
          <div className="mt-2 text-xs text-blue-600">
            按 Enter 開始搜尋
          </div>
        )}
      </div>

      {/* 統計資訊列 - 靠右對齊 */}
      <div className="px-4 md:px-6 py-2 bg-gray-50/50 border-t border-gray-100">
        <div className="text-sm text-gray-600 text-right">
          {getStatsText()}
        </div>
      </div>

      {/* 搜尋結果統計 - 僅在搜尋時顯示 */}
      {isSearching && (
        <div className="px-4 md:px-6 py-2 bg-blue-50/30 border-t border-blue-100">
          <div className="text-sm text-gray-700">
            找到 <span className="font-medium text-blue-700">{totalCount.toLocaleString()}</span> 篇
            關於 &ldquo;<SearchHighlight 
              text={currentFilters.searchQuery!} 
              searchTerm={currentFilters.searchQuery!}
              className="font-medium text-blue-700"
            />&rdquo; 的文章
            {totalCount > 0 && (
              <span className="ml-2 text-gray-600">
                (第 {currentPage} 頁)
              </span>
            )}
            
            {/* 清除搜尋按鈕 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearchClear}
              className="ml-3 h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
            >
              清除搜尋
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}