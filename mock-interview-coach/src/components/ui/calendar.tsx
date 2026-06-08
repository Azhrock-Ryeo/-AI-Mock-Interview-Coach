import * as React from "react"
import { cn } from "../../lib/utils.tsx"

export function Calendar({ children, className, ...props }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
}

export function CalendarDayButton(props: React.ComponentProps<'button'>) {
  return <button {...props} />
}
