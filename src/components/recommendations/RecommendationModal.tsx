'use client'

import { useState } from 'react'
import { ExternalLink, FileText, Loader2, Eye, Star, ArrowLeft, Heart } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSimilarArticles, useArticle } from '@/hooks/useArticles'
import { useLikes } from '@/hooks/useLikes'
import type { Article, RecommendedArticle } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RecommendationModalProps {
  isOpen: boolean
  onClose: () => void
  sourceArticle: Article | null
  onArticleClick?: (article: Article) => void
}

function RecommendationItem({ 
  article, 
  onArticleClick 
}: { 
  article: RecommendedArticle
  onArticleClick?: (article: Article) => void
}) {
  // 計算相似度等級和顏色 - 使用主頁的紫色系配色
  const getSimilarityBadge = (similarity: number) => {
    const percentage = similarity * 100
    if (percentage >= 80) {
      return { 
        text: '高度相似', 
        className: 'bg-purple-100 text-purple-800 border-purple-200' 
      }
    }
    if (percentage >= 60) {
      return { 
        text: '相當相似', 
        className: 'bg-blue-100 text-blue-800 border-blue-200' 
      }
    }
    if (percentage >= 40) {
      return { 
        text: '部分相似', 
        className: 'bg-green-100 text-green-800 border-green-200' 
      }
    }
    return { 
      text: '輕度相似', 
      className: 'bg-gray-100 text-gray-700 border-gray-200' 
    }
  }

  const similarityInfo = getSimilarityBadge(article.similarity)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-purple-300">
      <div className="space-y-3">
        {/* 相似度標籤 + 標題 */}
        <div className="flex items-start gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${similarityInfo.className} flex items-center gap-1 shrink-0`}>
            <Star className="w-3 h-3" />
            {(article.similarity * 100).toFixed(0)}% {similarityInfo.text}
          </div>
          
          <h4 
            className="font-semibold text-gray-900 leading-tight cursor-pointer hover:text-purple-700 transition-colors flex-1"
            onClick={() => onArticleClick?.(article)}
          >
            {article.title_translated || article.title || '無標題'}
          </h4>
        </div>

        {/* 摘要 */}
        {article.tldr && (
          <div className="bg-blue-50 border-l-4 border-blue-300 p-3 rounded-r-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              {article.tldr.length > 120 ? article.tldr.substring(0, 120) + '...' : article.tldr}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// 文章詳情卡片組件
function ArticleDetailCard({ 
  article, 
  onLike 
}: { 
  article: Article
  onLike?: () => void
}) {
  // 使用按讚 hook
  const {
    isLiked,
    totalLikes,
    toggleLike,
    isLoading: likeLoading
  } = useLikes(article.id)

  const handleLike = async () => {
    try {
      toggleLike()
      if (onLike) {
        onLike()
      }
    } catch (error) {
      console.error('按讚失敗:', error)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* 頂部：來源期刊標籤 + 按讚按鈕 */}
      <div className="flex items-center justify-between mb-4">
        <span className="bg-purple-100 text-purple-800 font-medium text-sm px-3 py-1 rounded-full">
          {article.source || 'Unknown Source'}
        </span>
        
        {/* 按讚按鈕 - 移到右上角 */}
        <button
          className={cn(
            "h-8 px-2 transition-colors min-w-[44px] rounded-md flex items-center gap-1",
            isLiked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
          )}
          onClick={handleLike}
          disabled={likeLoading}
        >
          <Heart 
            className={cn("w-4 h-4", isLiked && "fill-current")} 
          />
          <span className="text-xs font-medium">
            {totalLikes || 0}
          </span>
        </button>
      </div>

      {/* 標題區域 */}
      <div className="space-y-3 mb-6">
        <h2 className="font-semibold text-xl leading-tight text-gray-900">
          {article.title_translated || article.title || '無標題'}
        </h2>
        
        {article.title && article.title_translated && (
          <p className="text-sm text-gray-600 italic leading-relaxed">
            {article.title}
          </p>
        )}
      </div>

      {/* 發布日期 */}
      <div className="text-sm text-gray-500 mb-4">
        📅 {article.published ? new Date(article.published).toLocaleDateString('zh-TW') : '未知日期'}
      </div>

      {/* 摘要區域 */}
      {(article.tldr || article.english_tldr) && (
        <div className="space-y-4 mb-6">
          {/* 中文摘要 */}
          {article.tldr && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-300">
              <div className="text-sm text-gray-800 leading-relaxed">
                {article.tldr.includes('|') ? (
                  article.tldr.split('|').map((sentence, index, array) => (
                    <span key={index}>
                      <span className="font-medium text-gray-900">{sentence.trim()}</span>
                      {index < array.length - 1 && (
                        <span className="text-gray-500 font-bold mx-1"> | </span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="font-medium text-gray-900">{article.tldr}</span>
                )}
              </div>
            </div>
          )}
          
          {/* 英文摘要 */}
          {article.english_tldr && (
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
              <div className="text-sm text-gray-700 italic leading-relaxed">
                {article.english_tldr}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 底部操作按鈕 - 類似首頁卡片 */}
      <div className="pt-4 border-t bg-gray-50/50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
        <div className="flex gap-2">
          {article.link && (
            <button 
              onClick={() => window.open(article.link!, '_blank')}
              className="h-8 px-3 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              PubMed
            </button>
          )}
          
          {article.doi && (
            <button 
              onClick={() => window.open(`https://doi.org/${article.doi}`, '_blank')}
              className="h-8 px-3 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              DOI
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function RecommendationModal({ 
  isOpen, 
  onClose, 
  sourceArticle
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
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-lg">
            {selectedArticle ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="p-1 h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                📄 文章詳情
              </>
            ) : (
              <>
                🔍 相關文章推薦
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="pt-2">
          {selectedArticle ? (
            // 文章詳情視圖
            <div>
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
                  <p className="text-gray-600">正在載入文章詳情...</p>
                </div>
              ) : articleDetail ? (
                <div className="max-w-3xl mx-auto">
                  {/* 文章卡片 - 類似首頁設計 */}
                  <ArticleDetailCard 
                    article={articleDetail} 
                    onLike={() => {
                      // 重新載入文章詳情以更新按讚數
                      setTimeout(() => {
                        // 這裡可以觸發重新查詢，但簡單起見先保持現狀
                      }, 500)
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-red-500 text-4xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">無法載入文章</h3>
                  <p className="text-gray-600 mb-6">
                    無法取得文章詳細資訊，請稍後再試
                  </p>
                  <Button onClick={handleBackToList} variant="outline" size="lg">
                    返回列表
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // 推薦列表視圖
            <>
              {/* 載入中狀態 */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
                  <p className="text-gray-600">正在使用 AI 技術尋找相關文章...</p>
                </div>
              )}

              {/* 錯誤狀態 */}
              {error && (
                <div className="text-center py-16">
                  <div className="text-red-500 text-4xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">載入推薦文章時發生錯誤</h3>
                  <p className="text-gray-600 mb-6">
                    {error.message || '無法載入相關文章，請稍後再試'}
                  </p>
                  <Button onClick={onClose} variant="outline" size="lg">
                    關閉
                  </Button>
                </div>
              )}

              {/* 推薦文章列表 */}
              {similarArticles && similarArticles.length > 0 && (
                <div className="space-y-3 mt-2">
                  {similarArticles.map((article) => (
                    <RecommendationItem
                      key={article.id}
                      article={article}
                      onArticleClick={handleArticleClick}
                    />
                  ))}
                </div>
              )}

              {/* 無推薦文章 */}
              {similarArticles && similarArticles.length === 0 && !isLoading && !error && (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">找不到相關文章</h3>
                  <p className="text-gray-600 mb-6">
                    很抱歉，目前沒有找到與此文章相關的其他文章。<br />
                    這可能是因為該文章的主題比較獨特。
                  </p>
                  <Button onClick={handleClose} variant="outline" size="lg">
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
