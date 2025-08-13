'use client'

// 簡化版 toast 功能，避免複雜的 JSX 語法
export const toast = ({ title, description }: { title: string; description?: string }) => {
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

// 簡化版 useToast hook
export function useToast() {
  return {
    toast
  }
}
