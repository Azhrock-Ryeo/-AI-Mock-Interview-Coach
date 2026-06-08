import * as React from "react"
import { cn } from "../../lib/utils.tsx"

export type ChartConfig = Record<string, { label?: React.ReactNode; icon?: React.ComponentType }>

export function ChartContainer({ children, className, ...props }: { children?: React.ReactNode; className?: string; config: ChartConfig }) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
}

export function ChartTooltipContent() {
  return null
}

export function ChartLegendContent() {
  return null
}
