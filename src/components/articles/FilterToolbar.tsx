'use client'

import { Search, X } from 'lucide-react'
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
  currentPage?: number
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  onRefresh?: () => void
  isLoading?: boolean
  hideSearchBox?: boolean // 新增：是否隱藏搜尋框
  className?: string
}

const SORT_OPTIONS = [
  { value: 'created_at.desc', label: '最新收錄' },
  { value: 'published.desc', label: '最新發布' },
  { value: 'published.asc', label: '最舊發布' },
  { value: 'likes_count.desc', label: '最多按讚' },
] as const

const selectTriggerClass = "border-none shadow-none bg-transparent px-0 h-auto gap-1 font-normal text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)] focus-visible:ring-0 [&_svg]:text-[var(--brand-text-muted)]"
const searchInputClass = "pl-6 pr-8 border-0 border-b rounded-none shadow-none bg-transparent focus-visible:ring-0 border-[var(--brand-border)] focus-visible:border-[var(--brand-accent)]"

export function FilterToolbar({
  sources,
  currentFilters,
  onFiltersChange,
  totalCount,
  hideSearchBox = false,
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
  const hasUnsubmittedSearch = searchValue !== (currentFilters.searchQuery || '')

  return (
    <div className={cn("border-b border-[var(--brand-border)]", className)}>

      {/* 主工具列 */}
      <div className="px-4 sm:px-6 py-3.5">
        {/* 桌面版 */}
        <div className="hidden md:flex items-center justify-between gap-6">

          <div className="flex items-center gap-5 text-sm">
            {/* 來源篩選 */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[var(--brand-primary)]">篩選</span>
              <Select
                value={currentFilters.source || 'all'}
                onValueChange={handleSourceChange}
                disabled={isLoading}
              >
                <SelectTrigger className={cn(selectTriggerClass, currentFilters.source && "text-[var(--brand-accent)]")}>
                  <SelectValue placeholder="所有來源" />
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
            </div>

            <span className="w-px h-3.5 bg-[var(--brand-border)]" />

            {/* 排序方式 */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[var(--brand-primary)]">排序</span>
              <Select
                value={currentFilters.sortBy}
                onValueChange={handleSortChange}
                disabled={isLoading}
              >
                <SelectTrigger className={selectTriggerClass}>
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
            </div>
          </div>

          {/* 搜尋框 - 條件顯示 */}
          {!hideSearchBox && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--brand-text-faint)] w-4 h-4" />
                <Input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="搜尋關鍵字"
                  disabled={isLoading}
                  className={cn("h-8", searchInputClass)}
                />

                {/* 清除按鈕 */}
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    disabled={isLoading}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--brand-text-faint)] hover:text-[var(--brand-primary)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="text-xs text-[var(--brand-text-muted)] whitespace-nowrap">
            共 <span className="text-[var(--brand-primary)] font-semibold">{totalCount.toLocaleString()}</span> 篇文章
          </div>
        </div>

        {/* 手機版：垂直堆疊設計 */}
        <div className="md:hidden space-y-3">

          {/* 搜尋框 - 條件顯示 */}
          {!hideSearchBox && (
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--brand-text-faint)] w-4 h-4" />
              <Input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="搜尋關鍵字"
                disabled={isLoading}
                className={cn("h-9", searchInputClass)}
              />

              {/* 清除按鈕 */}
              {searchValue && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  disabled={isLoading}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--brand-text-faint)] hover:text-[var(--brand-primary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* 篩選控制項 */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[var(--brand-primary)]">篩選</span>
              <Select
                value={currentFilters.source || 'all'}
                onValueChange={handleSourceChange}
                disabled={isLoading}
              >
                <SelectTrigger className={cn(selectTriggerClass, currentFilters.source && "text-[var(--brand-accent)]")}>
                  <SelectValue placeholder="所有來源" />
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
            </div>

            <span className="w-px h-3.5 bg-[var(--brand-border)]" />

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[var(--brand-primary)]">排序</span>
              <Select
                value={currentFilters.sortBy}
                onValueChange={handleSortChange}
                disabled={isLoading}
              >
                <SelectTrigger className={selectTriggerClass}>
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
            </div>
          </div>
        </div>

        {/* 搜尋提示 - 條件顯示 */}
        {!hideSearchBox && hasUnsubmittedSearch && (
          <div className="mt-2 text-xs text-[var(--brand-accent)] text-center md:text-left">
            按 Enter 開始搜尋
          </div>
        )}
      </div>

      {/* 搜尋結果統計 - 僅在搜尋時顯示且不隱藏搜尋框時 */}
      {!hideSearchBox && isSearching && (
        <div className="px-4 sm:px-6 py-2.5 bg-[var(--brand-featured-bg)] border-t border-[var(--brand-border)]">
          <div className="text-sm text-[var(--brand-text)]">
            找到 <span className="font-medium text-[var(--brand-accent)]">{totalCount.toLocaleString()}</span> 篇
            關於 &ldquo;<SearchHighlight
              text={currentFilters.searchQuery!}
              searchTerm={currentFilters.searchQuery!}
              className="font-medium text-[var(--brand-accent)]"
            />&rdquo; 的文章

            {/* 清除搜尋按鈕 */}
            <button
              onClick={handleSearchClear}
              className="ml-3 text-xs text-[var(--brand-accent)] hover:text-[var(--brand-accent-dark)] underline underline-offset-2"
            >
              清除搜尋
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
