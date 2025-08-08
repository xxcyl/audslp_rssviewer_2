'use client'

import { RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { FilterOptions } from '@/lib/types'
import { cn } from '@/lib/utils'

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
  { value: 'published.desc', label: '發布日期 (新到舊)' },
  { value: 'published.asc', label: '發布日期 (舊到新)' },
  { value: 'created_at.desc', label: '收錄日期 (新到舊)' },
  { value: 'likes_count.desc', label: '按讚數 (高到低)' },
  { value: 'title', label: '標題 A-Z' },
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

  const totalPages = Math.ceil(totalCount / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className={cn(
      "bg-white border-b border-gray-200 px-6 py-4 shadow-sm",
      className
    )}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* 左側：篩選控制 */}
        <div className="flex flex-col sm:flex-row gap-4">
          
          {/* 來源篩選 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              來源篩選
            </label>
            <Select
              value={currentFilters.source || 'all'}
              onValueChange={handleSourceChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="選擇來源" />
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

          {/* 排序方式 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              排序方式
            </label>
            <Select
              value={currentFilters.sortBy}
              onValueChange={handleSortChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="選擇排序" />
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

        {/* 右側：統計資訊和操作按鈕 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          
          {/* 統計資訊 */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              總計 {totalCount.toLocaleString()} 篇
            </Badge>
            
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              第 {currentPage} / {totalPages} 頁
            </Badge>
            
            {totalCount > 0 && (
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                顯示 {startItem.toLocaleString()}-{endItem.toLocaleString()}
              </Badge>
            )}
          </div>

          {/* 重新載入按鈕 */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              重新載入
            </Button>
          )}
        </div>
      </div>

      {/* 活動篩選條件顯示 */}
      {currentFilters.source && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">篩選條件：</span>
            <Badge 
              variant="outline" 
              className="bg-blue-50 text-blue-700 border-blue-300"
            >
              來源：{currentFilters.source}
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => handleSourceChange('all')}
              >
                ✕
              </button>
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}