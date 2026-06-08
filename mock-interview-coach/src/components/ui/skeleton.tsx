import { cn } from "../../lib/utils.tsx"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md animate-pulse bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
