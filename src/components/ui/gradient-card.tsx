
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type GradientVariant = 
  | "primary"
  | "purple"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "indigo"
  | "pink"
  | "teal"
  | "orange"
  | "slate";

interface GradientCardProps extends React.ComponentProps<typeof Card> {
  variant?: GradientVariant;
  hoverEffect?: boolean;
  className?: string;
}

// Improved gradient classes with more vibrant colors
const gradientClasses: Record<GradientVariant, string> = {
  primary: "bg-gradient-to-br from-primary/15 to-purple-500/15 dark:from-primary/25 dark:to-purple-600/25 border-primary/20 dark:border-primary/30",
  purple: "bg-gradient-to-br from-purple-100 to-violet-100/80 dark:from-purple-900/30 dark:to-violet-800/30 border-purple-200/70 dark:border-purple-700/40",
  blue: "bg-gradient-to-br from-blue-100 to-indigo-100/80 dark:from-blue-900/30 dark:to-indigo-800/30 border-blue-200/70 dark:border-blue-700/40",
  green: "bg-gradient-to-br from-emerald-100 to-teal-100/80 dark:from-emerald-900/30 dark:to-teal-800/30 border-emerald-200/70 dark:border-emerald-700/40",
  amber: "bg-gradient-to-br from-amber-100 to-yellow-100/80 dark:from-amber-900/30 dark:to-yellow-800/30 border-amber-200/70 dark:border-amber-700/40",
  red: "bg-gradient-to-br from-red-100 to-rose-100/80 dark:from-red-900/30 dark:to-rose-800/30 border-red-200/70 dark:border-red-700/40",
  indigo: "bg-gradient-to-br from-indigo-100 to-blue-100/80 dark:from-indigo-900/30 dark:to-blue-800/30 border-indigo-200/70 dark:border-indigo-700/40",
  pink: "bg-gradient-to-br from-pink-100 to-rose-100/80 dark:from-pink-900/30 dark:to-rose-800/30 border-pink-200/70 dark:border-pink-700/40",
  teal: "bg-gradient-to-br from-teal-100 to-emerald-100/80 dark:from-teal-900/30 dark:to-emerald-800/30 border-teal-200/70 dark:border-teal-700/40",
  orange: "bg-gradient-to-br from-orange-100 to-amber-100/80 dark:from-orange-900/30 dark:to-amber-800/30 border-orange-200/70 dark:border-orange-700/40",
  slate: "bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200/70 dark:border-slate-700/40",
};

const GradientCard = React.forwardRef<
  HTMLDivElement,
  GradientCardProps
>(({ variant = "primary", hoverEffect = true, className, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        gradientClasses[variant],
        hoverEffect && "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50",
        className
      )}
      {...props}
    />
  );
});
GradientCard.displayName = "GradientCard";

// Re-export card subcomponents for convenience
export {
  GradientCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
