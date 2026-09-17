'use client'

import Link from 'next/link'
import { Bookmark as BookmarkIcon } from 'lucide-react'
import { ArticleGrid } from '@/components/articles/ArticleGrid'
import { AuthButton } from '@/components/auth/AuthButton'
import { useAuth } from '@/hooks/useAuth'
import { useMyBookmarks } from '@/hooks/useBookmarks'

export default function BookmarksPage() {
  const { user, isLoading: authLoading, openLogin } = useAuth()
  const { data: articles, isLoading: bookmarksLoading } = useMyBookmarks()

  return (
    <div className="min-h-screen bg-[var(--brand-bg)]">
      <header className="sticky top-0 z-40 bg-[var(--brand-primary)] py-3">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <h1>
              <Link
                href="/"
                className="flex items-center gap-1 text-[#FAFAF9] whitespace-nowrap hover:opacity-80 transition-opacity"
              >
                <span className="font-display text-xs md:text-sm">[</span>
                <span className="text-sm md:text-base font-bold tracking-wide">聽語期刊速報</span>
                <span className="font-display text-xs md:text-sm">]</span>
                <span className="font-display text-xs md:text-sm text-[var(--brand-accent)]">_</span>
              </Link>
            </h1>
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center gap-2 mb-6">
          <BookmarkIcon className="w-5 h-5 text-[var(--brand-primary)]" />
          <h2 className="text-xl font-semibold text-[var(--brand-primary)]">我的收藏</h2>
        </div>

        {authLoading ? null : !user ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center text-center gap-4">
            <p className="text-[var(--brand-text-muted)]">登入後即可查看你收藏的文章</p>
            <button
              type="button"
              onClick={openLogin}
              className="font-display text-[10px] text-[var(--brand-primary)] bg-[var(--brand-accent)] px-3 py-2 hover:brightness-95 transition-[filter]"
            >
              登入
            </button>
          </div>
        ) : (
          <ArticleGrid articles={articles || []} isLoading={bookmarksLoading} />
        )}
      </div>
    </div>
  )
}
