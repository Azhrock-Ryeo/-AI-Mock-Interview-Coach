import { useToast } from "../../hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(({ id, title, description }) => (
        <div
          key={id}
          className="pointer-events-auto rounded-xl border border-white/10 bg-zinc-900/90 backdrop-blur-sm shadow-xl px-4 py-3 text-sm text-white"
        >
          {title && <div className="font-semibold mb-0.5">{title}</div>}
          {description && <div className="opacity-70">{description}</div>}
        </div>
      ))}
    </div>
  )
}