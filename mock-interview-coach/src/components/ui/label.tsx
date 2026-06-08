import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"


import { cn } from "../../lib/utils"
 da9cb45e9c17f3caa44df60373cebe507628c6e4

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }