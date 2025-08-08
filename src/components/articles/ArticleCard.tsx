'use client'

import { useState } from 'react'
import { Heart, ExternalLink, FileText, Calendar, User, Hash, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Article } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: Article
  onLike?: (articleId: number) => void
  onRecommend?: (articleId: number) => void
  className?: string
  isLiked?: boolean
}

export function ArticleCard({ 
  article, 
  onLike, 
  onRecommend, 
  className,
  isLiked = false 
}: ArticleCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(article.likes_count)

  const handleLike = async () => {
    if (!onLike) return
    
    try {
      setLiked(!liked)
      setLikeCount(prev => liked ? prev - 1 : prev + 1)
      await onLike(article.id)
    } catch (error) {
      // 恢復狀態如果失敗
      setLiked(liked)
      setLikeCount(article.likes_count)
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
      month: 'long',
      day: 'numeric'
    })
  }

  const hasEmbedding = article.embedding && article.embedding.length > 0
  const hasDoi = article.doi && article.doi.trim() !== ''

  return (
    <Card className={cn(
      "flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <CardHeader className="space-y-3">
        {/* 來源標籤 */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
          >
            {article.source || 'Unknown Source'}
          </Badge>
        </div>

        {/* 標題 */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight text-gray-900">
            {article.title_translated || article.title || '無標題'}
          </h3>
          
          {article.title && article.title_translated && (
            <p className="text-sm text-gray-600 italic leading-relaxed">
              {article.title}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* 摘要 */}
        {(article.tldr || article.english_tldr) && (
          <div className="space-y-3">
            {article.tldr && (
              <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-500">
                <div className="text-sm text-gray-800 leading-relaxed">
                  {article.tldr.includes('|') ? (
                    article.tldr.split('|').map((sentence, index, array) => (
                      <span key={index}>
                        <span className="font-medium text-gray-900">{sentence.trim()}</span>
                        {index < array.length - 1 && (
                          <span className="text-green-600 font-bold mx-1"> | </span>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="font-medium text-gray-900">{article.tldr}</span>
                  )}
                </div>
              </div>
            )}
            
            {article.english_tldr && (
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="text-sm text-gray-800 italic leading-relaxed">
                  {article.english_tldr}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 元數據 */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>發布：{formatDate(article.published)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            <span>PMID：{article.pmid || 'N/A'}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>ID：{article.id}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>收錄：{formatDate(article.created_at)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t bg-gray-50/50">
        <div className="flex items-center justify-between w-full">
          {/* 操作按鈕 */}
          <div className="flex gap-2">
            {article.link && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => window.open(article.link!, '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                原文
              </Button>
            )}
            
            {article.doi && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
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
                className="text-xs text-green-600 hover:text-green-700"
                onClick={handleRecommend}
              >
                🔍 相關文章
              </Button>
            )}
          </div>

          {/* 按讚按鈕 */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 transition-colors",
                liked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
              )}
              onClick={handleLike}
              disabled={!onLike}
            >
              <Heart 
                className={cn("w-4 h-4", liked && "fill-current")} 
              />
            </Button>
            <span className="text-sm text-gray-500 font-medium">
              {likeCount}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}