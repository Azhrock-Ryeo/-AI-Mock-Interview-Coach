import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils.tsx";

type BadgeVariant = "easy" | "medium" | "hard" | "technical" | "behavioral" | "mixed" | "default";

interface AppBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  easy: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  hard: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  technical: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  behavioral: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  mixed: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800",
  default: "bg-muted text-muted-foreground border-border",
};

const getBadgeVariant = (label: string): BadgeVariant => {
  const l = label.toLowerCase();
  if (l === "easy") return "easy";
  if (l === "medium") return "medium";
  if (l === "hard") return "hard";
  if (l === "technical") return "technical";
  if (l === "behavioral") return "behavioral";
  if (l === "mixed") return "mixed";
  return "default";
};

const AppBadge = ({ variant, className, children, ...props }: AppBadgeProps) => {
  const resolved = variant ?? getBadgeVariant(String(children ?? ""));
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        variantStyles[resolved],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default AppBadge;