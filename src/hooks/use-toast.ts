'use client'

import { useState, useCallback } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  type?: 'default' | 'success' | 'error' | 'warning'
}

interface ToastState {
  toasts: Toast[]
}

let toastId = 0

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = useCallback(({ title, description, type = 'default' }: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`
    
    setState((prev) => ({
      toasts: [...prev.toasts, { id, title, description, type }]
    }))

    // Auto remove after 3 seconds
    setTimeout(() => {
      setState((prev) => ({
        toasts: prev.toasts.filter((t) => t.id !== id)
      }))
    }, 3000)

    return id
  }, [])

  const dismiss = useCallback((toastId: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== toastId)
    }))
  }, [])

  return {
    toast,
    dismiss,
    toasts: state.toasts
  }
}

// Simple toast component for display
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismiss } = useToast()

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-background border border-border rounded-lg p-4 shadow-lg max-w-sm animate-in slide-in-from-bottom-full"
            onClick={() => dismiss(toast.id)}
          >
            <div className="font-medium">{toast.title}</div>
            {toast.description && (
              <div className="text-sm text-muted-foreground mt-1">
                {toast.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

// Export toast function for direct use
export const toast = ({ title, description, type = 'default' }: Omit<Toast, 'id'>) => {
  // This is a simplified version - in a real app you'd use a proper toast library
  console.log(`Toast: ${title}${description ? ` - ${description}` : ''}`)
  
  // Try to use browser notification as fallback
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: description,
        icon: '/favicon.ico'
      })
    }
  }
}
