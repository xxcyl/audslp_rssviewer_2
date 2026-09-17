'use client'

import Link from 'next/link'
import { Bookmark, KeyRound, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'

export function AuthButton() {
  const { user, isLoading, signOut, openLogin } = useAuth()

  if (isLoading) return null

  if (!user) {
    // 英文 + icon：font-display（像素字體）沒有中文字符，中文字會落到 fallback
    // 字型渲染跑版，比照 Reroll／RANDOM PICK 等既有徽章的英文標籤處理方式。
    // 用 KeyRound 而不是 LogIn：LogIn/LogOut 兩個 icon 在小尺寸下幾乎分不出來
    // （差別只在箭頭方向跟門框位置這種細節），KeyRound 語意明確不會混淆
    return (
      <button
        type="button"
        onClick={openLogin}
        className="font-display flex items-center gap-1.5 h-9 text-[9px] text-[var(--brand-primary)] bg-[var(--brand-accent)] px-2.5 whitespace-nowrap hover:brightness-95 transition-[filter]"
      >
        <KeyRound className="w-3 h-3" />
        <span className="hidden sm:inline">LOG IN</span>
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center h-9 w-9 text-white/80 hover:text-white transition-colors"
        >
          <User className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm text-[var(--brand-text-muted)] truncate max-w-[220px]">
          {user.email}
        </div>
        <DropdownMenuItem asChild>
          <Link href="/bookmarks" className="flex items-center gap-2 cursor-pointer">
            <Bookmark className="w-4 h-4" />
            我的收藏
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 cursor-pointer">
          <LogOut className="w-4 h-4" />
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
