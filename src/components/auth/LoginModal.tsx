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
  const { signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setEmail('')
      setStatus('idle')
      setErrorMessage('')
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
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Mail className="w-10 h-10 text-[var(--brand-accent-dark)]" />
            <p className="text-base text-[var(--brand-text)]">
              登入連結已寄到 <span className="font-semibold">{email}</span>
            </p>
            <p className="text-sm text-[var(--brand-text-muted)]">
              點擊信件裡的連結即可完成登入，記得檢查垃圾郵件夾。
            </p>
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
