import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AppCardProps extends HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
  delay?: number;
}

const AppCard = forwardRef<HTMLDivElement, AppCardProps>(
  ({ animate = true, delay = 0, className, children, ...props }, ref) => {
    const base = (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border bg-card text-card-foreground shadow-sm shadow-black/5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );

    if (!animate) return base;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={cn(
          "rounded-2xl border border-border bg-card text-card-foreground shadow-sm shadow-black/5",
          className
        )}
        {...(props as object)}
      >
        {children}
      </motion.div>
    );
  }
);

AppCard.displayName = "AppCard";
export default AppCard;