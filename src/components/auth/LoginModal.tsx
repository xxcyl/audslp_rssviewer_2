'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { signInWithMagicLink, verifyEmailCode } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const [code, setCode] = useState('')
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'error'>('idle')
  const [verifyError, setVerifyError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('sending')
    const { error } = await signInWithMagicLink(email.trim())
    if (error) {
      setStatus('error')
      setErrorMessage(error)
    } else {
      setStatus('sent')
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setVerifyStatus('verifying')
    const { error } = await verifyEmailCode(email.trim(), code.trim())
    if (error) {
      setVerifyStatus('error')
      setVerifyError(error)
      return
    }
    // 驗證成功，onAuthStateChange 會更新登入狀態，直接關閉視窗
    onOpenChange(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setEmail('')
      setStatus('idle')
      setErrorMessage('')
      setCode('')
      setVerifyStatus('idle')
      setVerifyError('')
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-sm">登入</DialogTitle>
          <DialogDescription>
            輸入 Email，我們會寄一封登入連結給你，不需要密碼。
          </DialogDescription>
        </DialogHeader>

        {status === 'sent' ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <Mail className="w-10 h-10 text-[var(--brand-accent-dark)]" />
              <p className="text-base text-[var(--brand-text)]">
                信件已寄到 <span className="font-semibold">{email}</span>
              </p>
              <p className="text-sm text-[var(--brand-text-muted)]">
                點擊信件裡的連結即可完成登入，記得檢查垃圾郵件夾。
              </p>
            </div>

            <div className="border-t border-[var(--brand-border)] pt-4">
              <p className="text-sm text-[var(--brand-text-muted)] mb-3">
                在別的裝置上收信？點連結只會讓「收信的那個裝置」登入。
                直接輸入信裡的 6 位數驗證碼，就能在這裡完成登入：
              </p>
              <form onSubmit={handleVerifyCode} className="flex flex-col gap-3">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="輸入 6 位數驗證碼"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={verifyStatus === 'verifying'}
                />
                {verifyStatus === 'error' && (
                  <p className="text-sm text-red-600">{verifyError}</p>
                )}
                <Button
                  type="submit"
                  disabled={verifyStatus === 'verifying'}
                  className="bg-[var(--brand-accent)] text-[var(--brand-primary)] hover:bg-[var(--brand-accent)]/90"
                >
                  {verifyStatus === 'verifying' ? '驗證中...' : '驗證並登入'}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'sending'}
            />
            {status === 'error' && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            <Button
              type="submit"
              disabled={status === 'sending'}
              className="bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary)]/90"
            >
              {status === 'sending' ? '傳送中...' : '傳送登入連結'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
