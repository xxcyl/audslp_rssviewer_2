'use client'

import { RefreshCw, Filter, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SearchStats } from '@/components/articles/SearchBar'
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

export function FilterToolbar({
  sources,
  currentFilters,
  onFiltersChange,
  totalCount,
  currentPage,
  pageSize,
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

  const isSearching = !!currentFilters.searchQuery
  const hasActiveFilters = !!currentFilters.source || !!currentFilters.searchQuery
  const hasUnsubmittedSearch = searchValue !== (currentFilters.searchQuery || '')

  return (
    <div className={cn(
      "bg-white border-b border-gray-200",
      className
    )}>
      {/* 主要工具列 - 更緊湊的設計 */}
      <div className="px-4 md:px-6 py-3">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          
          {/* 左側：搜尋框 */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="搜尋文章標題和摘要..."
                disabled={isLoading}
                className={cn(
                  "pl-10 pr-10 h-9",
                  "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            
            {/* 搜尋提示 */}
            {hasUnsubmittedSearch && (
              <div className="mt-1 text-xs text-gray-500">
                按 Enter 開始搜尋
              </div>
            )}
          </div>

          {/* 右側：篩選控制和操作按鈕 */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* 來源篩選 - 更簡潔的設計 */}
            <Select
              value={currentFilters.source || 'all'}
              onValueChange={handleSourceChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <Filter className="w-3 h-3 mr-2 text-gray-500" />
                <SelectValue placeholder="來源" />
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

            {/* 排序方式 - 更簡潔的設計 */}
            <Select
              value={currentFilters.sortBy}
              onValueChange={handleSortChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[120px] h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 重新載入按鈕 */}
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-9 px-3"
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 搜尋結果統計和活動篩選條件 */}
      {(isSearching || hasActiveFilters) && (
        <div className="px-4 md:px-6 py-2 bg-blue-50/30 border-t border-blue-100">
          
          {/* 搜尋統計 */}
          {isSearching && (
            <SearchStats
              query={currentFilters.searchQuery!}
              totalResults={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              className="mb-2"
            />
          )}

          {/* 活動篩選條件顯示 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">篩選：</span>
            
            {/* 來源篩選 Badge */}
            {currentFilters.source && (
              <Badge 
                variant="outline" 
                className="bg-white text-blue-700 border-blue-300 text-xs"
              >
                來源：{currentFilters.source}
                <button 
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  onClick={() => handleSourceChange('all')}
                >
                  ✕
                </button>
              </Badge>
            )}

            {/* 搜尋關鍵字 Badge */}
            {currentFilters.searchQuery && (
              <Badge 
                variant="outline" 
                className="bg-white text-green-700 border-green-300 text-xs"
              >
                關鍵字：{currentFilters.searchQuery}
                <button 
                  className="ml-1 text-green-500 hover:text-green-700"
                  onClick={handleSearchClear}
                >
                  ✕
                </button>
              </Badge>
            )}

            {/* 清除所有篩選 */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchValue('')
                  onFiltersChange({ sortBy: currentFilters.sortBy })
                }}
                className="text-gray-500 hover:text-gray-700 text-xs h-6 px-2"
              >
                清除篩選
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 簡潔的統計資訊 - 只在非搜尋狀態顯示 */}
      {!isSearching && (
        <div className="px-4 md:px-6 py-2 bg-gray-50/50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>共 <strong className="text-gray-900">{totalCount.toLocaleString()}</strong> 篇文章</span>
              {currentFilters.source && (
                <span className="text-blue-600">• 來源：{currentFilters.source}</span>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              第 {currentPage} / {Math.ceil(totalCount / pageSize)} 頁
            </div>
          </div>
        </div>
      )}
    </div>
  )
}