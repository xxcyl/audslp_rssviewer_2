'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "搜尋文章標題和摘要...",
  className,
  disabled = false
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // 同步外部值
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange('')
    onClear?.()
  }

  const handleSearch = () => {
    if (localValue !== value) {
      onChange(localValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-10 pr-10 h-10",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "border-gray-300 rounded-lg",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        
        {/* 清除按鈕 */}
        {localValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-400" />
          </Button>
        )}
      </div>
      
      {/* 搜尋按鈕 (當有輸入但未搜尋時顯示) */}
      {localValue && localValue !== value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSearch}
          disabled={disabled}
          className="ml-2 px-3 h-10 text-sm"
        >
          搜尋
        </Button>
      )}
      
      {/* 提示文字 */}
      {localValue && localValue !== value && (
        <div className="absolute left-3 -bottom-6 text-xs text-gray-500">
          按 Enter 或點擊搜尋按鈕開始搜尋
        </div>
      )}
    </div>
  )
}

// 搜尋結果高亮組件
interface SearchHighlightProps {
  text: string
  searchTerm: string
  className?: string
}

export function SearchHighlight({ text, searchTerm, className }: SearchHighlightProps) {
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>
  }

  // 將搜尋詞分割並建立正規表達式
  const searchWords = searchTerm
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // 跳脫特殊字符

  if (searchWords.length === 0) {
    return <span className={className}>{text}</span>
  }

  const regex = new RegExp(`(${searchWords.join('|')})`, 'gi')
  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isHighlight = searchWords.some(word => 
          part.toLowerCase() === word.toLowerCase()
        )
        
        return isHighlight ? (
          <mark
            key={index}
            className="bg-yellow-200 text-yellow-900 px-1 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      })}
    </span>
  )
}

// 搜尋統計組件
interface SearchStatsProps {
  query: string
  totalResults: number
  currentPage: number
  pageSize: number
  className?: string
}

export function SearchStats({
  query,
  totalResults,
  currentPage,
  pageSize,
  className
}: SearchStatsProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalResults)

  if (!query) return null

  return (
    <div className={cn("text-sm text-gray-600", className)}>
      找到 <span className="font-medium">{totalResults.toLocaleString()}</span> 篇
      關於 &ldquo;<span className="font-medium text-blue-600">{query}</span>&rdquo; 的文章
      {totalResults > 0 && (
        <span className="ml-2">
          (顯示第 {startItem}-{endItem} 篇)
        </span>
      )}
    </div>
  )
}
