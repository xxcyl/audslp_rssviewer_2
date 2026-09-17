'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { LoginModal } from '@/components/auth/LoginModal'

interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>
  verifyEmailCode: (email: string, token: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  openLogin: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    })
    return { error: error?.message ?? null }
  }

  // 跨裝置收信時（例如電腦上按登入、手機收信）點連結只會讓手機登入，
  // 電腦那邊收不到 token。改用信裡同時附的 6 位數驗證碼，手動輸入回
  // 原本操作的裝置，就能確保登入的是發起請求的那個瀏覽器
  const verifyEmailCode = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        isLoading,
        signInWithMagicLink,
        verifyEmailCode,
        signOut,
        openLogin: () => setIsLoginOpen(true),
      }}
    >
      {children}
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth 必須在 AuthProvider 內使用')
  }
  return ctx
}
