'use client'

import { useState } from 'react'
import { X, ExternalLink, FileText, Calendar, Hash, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSimilarArticles } from '@/hooks/useArticles'
import type { Article } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RecommendationModalProps {
  isOpen: boolean
  onClose: () => void
  sourceArticle: Article | null
  onArticleClick?: (article: Article) => void
}

function RecommendationItem({ 
  article, 
  similarity, 
  onArticleClick 
}: { 
  article: Article
  similarity: number
  onArticleClick?: (article: Article) => void
}) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未知日期'
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onArticleClick?.(article)}
    >
      {/* 標題和相似度 */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 mr-3">
          {article.title_translated || article.title || '無標題'}
        </h4>
        <Badge 
          variant="secondary" 
          className="bg-blue-100 text-blue-700 text-xs whitespace-nowrap"
        >
          {(similarity * 100).toFixed(0)}% 相似
        </Badge>
      </div>

      {/* 摘要 */}
      {article.tldr && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {article.tldr.length > 120 ? article.tldr.substring(0, 120) + '...' : article.tldr}
        </p>
      )}

      {/* 元數據 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(article.published)}
          </span>
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            {article.pmid || 'N/A'}
          </span>
        </div>
        
        <div className="flex gap-1">
          {article.link && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                window.open(article.link!, '_blank')
              }}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
          {article.doi && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://doi.org/${article.doi}`, '_blank')
              }}
            >
              <FileText className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* 點擊提示 */}
      <div className="mt-2 text-xs text-green-600 font-medium">
        💡 點擊查看完整資訊
      </div>
    </div>
  )
}

export function RecommendationModal({ 
  isOpen, 
  onClose, 
  sourceArticle,
  onArticleClick 
}: RecommendationModalProps) {
  const {
    data: similarArticles,
    isLoading,
    error
  } = useSimilarArticles(
    sourceArticle?.id || null,
    isOpen && !!sourceArticle?.id
  )

  const handleArticleClick = (article: Article) => {
    onArticleClick?.(article)
    onClose() // 關閉 modal
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            🔍 相關文章推薦
            {sourceArticle && (
              <Badge variant="outline" className="ml-2">
                基於：{sourceArticle.source}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 來源文章資訊 */}
          {sourceArticle && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-1">
                📄 來源文章
              </h3>
              <p className="text-sm text-blue-800">
                {sourceArticle.title_translated || sourceArticle.title || '無標題'}
              </p>
            </div>
          )}

          {/* 載入中狀態 */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">正在尋找相關文章...</p>
            </div>
          )}

          {/* 錯誤狀態 */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">載入推薦文章時發生錯誤</h3>
              <p className="text-gray-600 mb-4">
                {error.message || '無法載入相關文章，請稍後再試'}
              </p>
              <Button onClick={onClose} variant="outline">
                關閉
              </Button>
            </div>
          )}

          {/* 推薦文章列表 */}
          {similarArticles && similarArticles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  找到 {similarArticles.length} 篇相關文章
                </h3>
                <p className="text-sm text-gray-500">
                  按相似度排序
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similarArticles.map((article) => (
                  <RecommendationItem
                    key={article.id}
                    article={article}
                    similarity={article.similarity}
                    onArticleClick={handleArticleClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 無推薦文章 */}
          {similarArticles && similarArticles.length === 0 && !isLoading && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">找不到相關文章</h3>
              <p className="text-gray-600 mb-4">
                很抱歉，目前沒有找到與此文章相關的其他文章。<br />
                這可能是因為該文章的主題比較獨特，或者相關文章的相似度較低。
              </p>
              <Button onClick={onClose} variant="outline">
                關閉
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}