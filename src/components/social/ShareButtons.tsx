'use client'

import { Share2, Facebook, Twitter, Link2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
// import { toast } from '@/hooks/use-toast'

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
  className?: string
  variant?: 'default' | 'inline' | 'minimal'
}

export function ShareButtons({ 
  title, 
  url, 
  description = '', 
  className = '',
  variant = 'default'
}: ShareButtonsProps) {
  const shareData = {
    title,
    text: description,
    url
  }

  const handleShare = async (platform: string) => {
    const encodedTitle = encodeURIComponent(title)
    const encodedUrl = encodeURIComponent(url)
    const encodedDescription = encodeURIComponent(description)
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=聽力學,語言治療,期刊,學術研究`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A查看詳情：${encodedUrl}`,
      copy: url
    }

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share(shareData)
        // toast({
        //   title: '分享成功',
        //   description: '已成功分享內容'
        // })
        console.log('分享成功')
      } catch (error) {
        console.log('分享取消或失敗:', error)
      }
      return
    }

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url)
        // toast({
        //   title: '連結已複製',
        //   description: '連結已複製到剪貼板'
        // })
        console.log('連結已複製')
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        // toast({
        //   title: '連結已複製',
        //   description: '連結已複製到剪貼板'
        // })
        console.log('連結已複製')
      }
      return
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  // 檢查是否支援原生分享
  const supportsNativeShare = typeof navigator !== 'undefined' && navigator.share

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare(supportsNativeShare ? 'native' : 'copy')}
        className={className}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-muted-foreground">分享：</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('facebook')}
          className="h-8 w-8 p-0"
          aria-label="分享到 Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('twitter')}
          className="h-8 w-8 p-0"
          aria-label="分享到 Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('line')}
          className="h-8 w-8 p-0"
          aria-label="分享到 LINE"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('copy')}
          className="h-8 w-8 p-0"
          aria-label="複製連結"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Default dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          分享
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportsNativeShare && (
          <DropdownMenuItem 
            onClick={() => handleShare('native')}
            className="cursor-pointer"
          >
            <Share2 className="h-4 w-4 mr-2" />
            系統分享
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => handleShare('facebook')}
          className="cursor-pointer"
        >
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare('twitter')}
          className="cursor-pointer"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare('line')}
          className="cursor-pointer"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          LINE
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare('email')}
          className="cursor-pointer"
        >
          <Share2 className="h-4 w-4 mr-2" />
          電子郵件
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare('copy')}
          className="cursor-pointer"
        >
          <Link2 className="h-4 w-4 mr-2" />
          複製連結
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 專用於首頁的網站分享
export function SiteShareButtons({ className }: { className?: string }) {
  return (
    <ShareButtons
      title="聽語期刊速報 | 聽力學與語言治療期刊推播網站"
      url="https://audslp.vercel.app"
      description="專業的聽力學與語言治療期刊推播網站，提供最新的學術研究、AI 智能推薦、跨期刊文章搜尋和研究趨勢追蹤。"
      className={className}
      variant="inline"
    />
  )
}
