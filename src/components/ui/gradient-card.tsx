
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

const gradientClasses: Record<GradientVariant, string> = {
  primary: "bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-600/20 border-primary/20 dark:border-primary/30",
  purple: "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200/50 dark:border-purple-800/30",
  blue: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200/50 dark:border-blue-800/30",
  green: "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 border-green-200/50 dark:border-green-800/30",
  amber: "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200/50 dark:border-amber-800/30",
  red: "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border-red-200/50 dark:border-red-800/30",
  indigo: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200/50 dark:border-indigo-800/30",
  pink: "bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200/50 dark:border-pink-800/30",
  teal: "bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/20 border-teal-200/50 dark:border-teal-800/30",
  orange: "bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200/50 dark:border-orange-800/30",
  slate: "bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/30 border-slate-200/50 dark:border-slate-800/30",
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
        hoverEffect && "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
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
