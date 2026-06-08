import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils.tsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "gradient-primary text-white shadow-md shadow-primary/25 hover:opacity-90 hover:shadow-lg hover:shadow-primary/30",
  secondary:
    "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
  danger:
    "bg-destructive text-destructive-foreground shadow-sm hover:opacity-90",
  ghost:
    "bg-transparent text-foreground hover:bg-muted",
};

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "h-8 px-3 text-sm rounded-lg gap-1.5",
  md: "h-10 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-7 text-base rounded-xl gap-2",
};

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ variant = "primary", size = "md", loading = false, disabled, className, children, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? {} : { scale: 0.97 }}
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...(props as any)}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

AppButton.displayName = "AppButton";
export default AppButton;