'use client'

import Link from 'next/link'
import { Bookmark, LogOut, User } from 'lucide-react'
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
    return (
      <button
        type="button"
        onClick={openLogin}
        className="font-display text-[9px] text-[var(--brand-primary)] bg-[var(--brand-accent)] px-2.5 py-1.5 whitespace-nowrap hover:brightness-95 transition-[filter]"
      >
        登入
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
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
