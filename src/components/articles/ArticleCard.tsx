'use client'

import { useState, useEffect } from 'react'
import { Heart, ExternalLink, FileText, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLikes } from '@/hooks/useLikes'
import { SearchHighlight } from './SearchBar'
import type { Article } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  onLike?: (articleId: number) => void
  onRecommend?: (articleId: number) => void
  searchTerm?: string // 新增：搜尋詞用於高亮
  className?: string
}

export function ArticleCard({ 
  article, 
  onLike, 
  onRecommend,
  searchTerm, // 新增參數
  className
}: ArticleCardProps) {
  // 使用按讚 hook
  const {
    isLiked,
    totalLikes,
    toggleLike,
    isLoading: likeLoading
  } = useLikes(article.id)
  
  // 本地狀態
  const [localLiked, setLocalLiked] = useState(isLiked)
  const [localLikeCount, setLocalLikeCount] = useState(totalLikes)
  const [showEnglishSummary, setShowEnglishSummary] = useState(false)
  
  // 同步遠端狀態
  useEffect(() => {
    setLocalLiked(isLiked)
    setLocalLikeCount(totalLikes)
  }, [isLiked, totalLikes])

  const handleLike = async () => {
    try {
      // 樂觀更新 UI
      setLocalLiked(!localLiked)
      setLocalLikeCount(prev => localLiked ? prev - 1 : prev + 1)
      
      // 呼叫 hook 中的按讚函數
      toggleLike()
      
      // 通知父組件
      if (onLike) {
        onLike(article.id)
      }
    } catch (error) {
      // 如果失敗，恢復狀態
      setLocalLiked(isLiked)
      setLocalLikeCount(totalLikes)
      console.error('按讚失敗:', error)
    }
  }

  const handleRecommend = () => {
    if (onRecommend) {
      onRecommend(article.id)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未知日期'
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const hasEmbedding = article.embedding && article.embedding.length > 0

  return (
    <Card className={cn(
      "flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      // 手機版卡片加大，增加內邊距
      "p-2 md:p-3", // 增加內邊距
      className
    )}>
      <CardHeader className="space-y-3 pb-3 px-2 md:px-4">
        {/* 來源標籤 */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className="bg-purple-100 text-purple-800 font-medium text-xs px-2 py-1"
          >
            {article.source || 'Unknown Source'}
          </Badge>
        </div>

        {/* 標題 */}
        <div className="space-y-2">
          <h3 className="font-semibold text-base md:text-lg leading-tight text-gray-900">
            <SearchHighlight 
              text={article.title_translated || article.title || '無標題'}
              searchTerm={searchTerm || ''}
            />
          </h3>
          
          {article.title && article.title_translated && (
            <p className="text-xs md:text-sm text-gray-600 italic leading-relaxed">
              <SearchHighlight 
                text={article.title}
                searchTerm={searchTerm || ''}
              />
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 px-2 md:px-4">
        {/* 發布日期 */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3 shrink-0" />
          <span className="truncate">{formatDate(article.published)}</span>
        </div>

        {/* 摘要 */}
        {(article.tldr || article.english_tldr) && (
          <div className="space-y-3">
            {/* 中文摘要 */}
            {article.tldr && (
              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-300">
                <div className="text-xs md:text-sm text-gray-800 leading-relaxed">
                  {article.tldr.includes('|') ? (
                    article.tldr.split('|').map((sentence, index, array) => (
                      <span key={index}>
                        <span className="font-medium text-gray-900">
                          <SearchHighlight 
                            text={sentence.trim()}
                            searchTerm={searchTerm || ''}
                          />
                        </span>
                        {index < array.length - 1 && (
                          <span className="text-gray-500 font-bold mx-1"> | </span>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="font-medium text-gray-900">
                      <SearchHighlight 
                        text={article.tldr}
                        searchTerm={searchTerm || ''}
                      />
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* 原文摘要 - 可展開/收合 */}
            {article.english_tldr && (
              <div className="space-y-2">
                {!showEnglishSummary ? (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowEnglishSummary(true)}
                    >
                      <span className="mr-1">展開原文摘要</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 font-medium">原文摘要</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowEnglishSummary(false)}
                      >
                        <span className="mr-1">收合</span>
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-400 animate-in slide-in-from-top-2 duration-200">
                      <div className="text-xs md:text-sm text-gray-800 italic leading-relaxed">
                        <SearchHighlight 
                          text={article.english_tldr}
                          searchTerm={searchTerm || ''}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t bg-gray-50/50 px-2 md:px-4">
        <div className="flex items-center justify-between w-full gap-2">
          {/* 操作按鈕 */}
          <div className="flex gap-1 md:gap-2 flex-1">
            {article.link && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={() => window.open(article.link!, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                <span className="hidden md:inline">PubMed</span>
              </Button>
            )}
            
            {article.doi && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={() => window.open(`https://doi.org/${article.doi}`, '_blank')}
              >
                <FileText className="w-3 h-3 mr-1" />
                <span className="hidden md:inline">DOI</span>
              </Button>
            )}
            
            {hasEmbedding && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs text-gray-600 hover:text-gray-700 px-2 py-1 h-7"
                onClick={handleRecommend}
              >
                🔍 <span className="hidden md:inline ml-1">相關</span>
              </Button>
            )}
          </div>

          {/* 按讚按鈕 - 增大觸控區域 */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 md:p-2 transition-colors min-w-[40px] h-8", // 增大最小寬度和高度
                localLiked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
              )}
              onClick={handleLike}
              disabled={likeLoading}
            >
              <Heart 
                className={cn("w-4 h-4", localLiked && "fill-current")} 
              />
            </Button>
            <span className="text-xs md:text-sm text-gray-500 font-medium min-w-[20px] text-center">
              {localLikeCount || 0}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}