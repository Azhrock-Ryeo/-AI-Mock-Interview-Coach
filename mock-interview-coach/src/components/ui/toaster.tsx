
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
 da9cb45e9c17f3caa44df60373cebe507628c6e4

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>

      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
 da9cb45e9c17f3caa44df60373cebe507628c6e4
      <ToastViewport />
    </ToastProvider>
  )
}
