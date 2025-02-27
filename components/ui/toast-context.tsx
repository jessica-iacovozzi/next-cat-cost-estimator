"use client"

import React, { createContext, useContext, useState } from 'react'
import { 
  Toast, 
  ToastClose, 
  ToastDescription, 
  ToastProvider, 
  ToastTitle, 
  ToastViewport 
} from './toast'

type ToastType = {
  id: string
  title?: string
  description: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
  position?: 'default' | 'center'
}

type ToastContextType = {
  toasts: ToastType[]
  addToast: (toast: Omit<ToastType, 'id'>) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const addToast = (toast: Omit<ToastType, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    
    setToasts((prevToasts) => [...prevToasts, newToast])
    
    // Auto dismiss after duration
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id)
      }, toast.duration || 3000)
    }
  }

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      <ToastProvider>
        {children}
        {toasts.map(({ id, title, description, variant, duration, position }) => (
          <Toast 
            key={id} 
            variant={variant} 
            duration={duration}
            className={position === 'center' ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] max-w-md' : undefined}
          >
            {title && <ToastTitle>{title}</ToastTitle>}
            <ToastDescription>{description}</ToastDescription>
            <ToastClose onClick={() => dismissToast(id)} />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastContextProvider')
  }
  return context
}
