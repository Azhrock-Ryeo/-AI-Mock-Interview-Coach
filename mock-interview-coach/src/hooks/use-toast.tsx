import type { ReactNode } from "react"

export type ToastEntry = {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
} & Record<string, unknown>

export function useToast() {
  return {
    toasts: [] as ToastEntry[],
    toast: (_options: { title?: string; description?: string } = {}) => {
      return undefined
    },
  }
}
