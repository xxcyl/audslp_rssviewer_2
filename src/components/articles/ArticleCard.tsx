'use client'

import { useState, useEffect } from 'react'
import { Heart, ExternalLink, FileText, Calendar, Search } from 'lucide-react'
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
        {/* 來源標籤 + 按讚按鈕 */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className="bg-purple-100 text-purple-800 font-medium text-xs px-2 py-1"
          >
            {article.source || 'Unknown Source'}
          </Badge>
          
          {/* 按讚按鈕 - 移到右上角 */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 px-2 transition-colors min-w-[40px]",
              localLiked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
            )}
            onClick={handleLike}
            disabled={likeLoading}
          >
            <Heart 
              className={cn("w-4 h-4 mr-1", localLiked && "fill-current")} 
            />
            <span className="text-xs font-medium">
              {localLikeCount || 0}
            </span>
          </Button>
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
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(article.published)}
        </div>

        {/* 摘要區域 - 直接顯示，無需展開按鈕 */}
        {(article.tldr || article.english_tldr) && (
          <div className="space-y-3">
            {/* 中文摘要 */}
            {article.tldr && (
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-300">
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
            
            {/* 原文摘要 */}
            {article.english_tldr && (
              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-gray-400">
                <div className="text-xs md:text-sm text-gray-700 italic leading-relaxed">
                  <SearchHighlight 
                    text={article.english_tldr}
                    searchTerm={searchTerm || ''}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t bg-gray-50/50 px-2 md:px-4">
        {/* 功能按鈕 */}
        <div className="flex gap-2">
          {article.link && (
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => window.open(article.link!, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              PubMed
            </Button>
          )}
          
          {article.doi && (
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => window.open(`https://doi.org/${article.doi}`, '_blank')}
            >
              <FileText className="w-3 h-3 mr-1" />
              DOI
            </Button>
          )}
          
          {hasEmbedding && (
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={handleRecommend}
            >
              <Search className="w-3 h-3 mr-1" />
              相關
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}