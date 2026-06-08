import { useToast } from "../../hooks/use-toast.tsx"
import { ToastProvider, ToastViewport } from "./toast.tsx"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }: any) => (
        <div key={id} {...props}>
          {title}
          {description}
          {action}
        </div>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
