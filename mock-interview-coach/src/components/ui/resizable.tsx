import * as React from "react"
import { cn } from "../../lib/utils.tsx"

export const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn("flex h-full w-full", className)} {...props} />
)

export const ResizablePanel = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn(className)} {...props} />
)

export const ResizableHandle = ({ withHandle, className, ...props }: React.ComponentProps<'div'> & { withHandle?: boolean }) => (
  <div className={cn("cursor-col-resize", className)} {...props}>
    {withHandle && <div className="h-4 w-4 rounded-sm bg-border" />}
  </div>
)
