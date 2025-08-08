'use client'

import { useState } from 'react'
import { X, ExternalLink, FileText, Calendar, Hash, Loader2, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSimilarArticles, useArticle } from '@/hooks/useArticles'
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
    <div className="border-b border-gray-100 last:border-b-0 py-4 px-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* 左側內容 */}
        <div className="flex-1 min-w-0">
          {/* 標題和相似度 */}
          <div className="flex items-start gap-3 mb-3">
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1">
              {article.title_translated || article.title || '無標題'}
            </h4>
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-700 text-xs whitespace-nowrap shrink-0"
            >
              {(similarity * 100).toFixed(0)}% 相似
            </Badge>
          </div>

          {/* 摘要 */}
          {article.tldr && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {article.tldr.length > 100 ? article.tldr.substring(0, 100) + '...' : article.tldr}
            </p>
          )}

          {/* 元數據和操作按鈕 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(article.published)}
              </span>
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {article.pmid || 'N/A'}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => onArticleClick?.(article)}
              >
                <Eye className="w-3 h-3 mr-1" />
                閱讀全文
              </Button>
              
              {article.link && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-3 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(article.link!, '_blank')
                  }}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  原文
                </Button>
              )}
              
              {article.doi && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-3 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`https://doi.org/${article.doi}`, '_blank')
                  }}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  DOI
                </Button>
              )}
            </div>
          </div>
        </div>
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  
  const {
    data: similarArticles,
    isLoading,
    error
  } = useSimilarArticles(
    sourceArticle?.id || null,
    isOpen && !!sourceArticle?.id
  )

  const {
    data: articleDetail,
    isLoading: isDetailLoading
  } = useArticle(
    selectedArticle?.id || null,
    !!selectedArticle
  )

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article)
  }

  const handleBackToList = () => {
    setSelectedArticle(null)
  }

  const handleClose = () => {
    setSelectedArticle(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {selectedArticle ? (
              <>
                <button 
                  onClick={handleBackToList}
                  className="text-blue-600 hover:text-blue-700 mr-2"
                >
                  ←
                </button>
                📄 文章詳情
              </>
            ) : (
              <>🔍 相關文章推薦</>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {selectedArticle ? (
            // 文章詳情視圖
            <div>
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                  <p className="text-gray-600">正在載入文章詳情...</p>
                </div>
              ) : articleDetail ? (
                <div className="space-y-6">
                  {/* 文章標題 */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {articleDetail.title_translated || articleDetail.title || '無標題'}
                    </h2>
                    {articleDetail.title && articleDetail.title_translated && (
                      <p className="text-lg text-gray-600 italic">
                        {articleDetail.title}
                      </p>
                    )}
                  </div>

                  {/* 來源和日期 */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">來源：</span>
                        <span className="ml-2">{articleDetail.source}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">發布日期：</span>
                        <span className="ml-2">
                          {articleDetail.published ? new Date(articleDetail.published).toLocaleDateString('zh-TW') : '未知'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">PMID：</span>
                        <span className="ml-2">{articleDetail.pmid || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">按讚數：</span>
                        <span className="ml-2">{articleDetail.likes_count || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* 摘要 */}
                  {(articleDetail.tldr || articleDetail.english_tldr) && (
                    <div className="space-y-4">
                      {articleDetail.tldr && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">📝 中文摘要</h3>
                          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                            <div className="text-gray-800 leading-relaxed">
                              {articleDetail.tldr.includes('|') ? (
                                articleDetail.tldr.split('|').map((sentence, index, array) => (
                                  <span key={index}>
                                    <span className="font-medium">{sentence.trim()}</span>
                                    {index < array.length - 1 && (
                                      <span className="text-green-600 font-bold mx-2"> | </span>
                                    )}
                                  </span>
                                ))
                              ) : (
                                <span className="font-medium">{articleDetail.tldr}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {articleDetail.english_tldr && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">🔤 English Summary</h3>
                          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <div className="text-gray-800 italic leading-relaxed">
                              {articleDetail.english_tldr}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 操作按鈕 */}
                  <div className="flex gap-3 pt-4 border-t">
                    {articleDetail.link && (
                      <Button
                        onClick={() => window.open(articleDetail.link!, '_blank')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        查看原文
                      </Button>
                    )}
                    {articleDetail.doi && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(`https://doi.org/${articleDetail.doi}`, '_blank')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        DOI 連結
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-red-500 text-4xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">無法載入文章</h3>
                  <p className="text-gray-600 mb-4">
                    無法取得文章詳細資訊，請稍後再試
                  </p>
                  <Button onClick={handleBackToList} variant="outline">
                    返回列表
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // 推薦列表視圖
            <>
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

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                  <Button onClick={handleClose} variant="outline">
                    關閉
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}