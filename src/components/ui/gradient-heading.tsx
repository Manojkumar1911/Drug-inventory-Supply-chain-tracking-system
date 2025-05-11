
import * as React from "react";
import { cn } from "@/lib/utils";

type GradientVariant = 
  | "primary"
  | "purple"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "indigo"
  | "pink"
  | "multi";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const gradientClasses: Record<GradientVariant, string> = {
  primary: "bg-gradient-to-r from-primary to-purple-600",
  purple: "bg-gradient-to-r from-purple-500 to-violet-600",
  blue: "bg-gradient-to-r from-blue-500 to-indigo-600",
  green: "bg-gradient-to-r from-emerald-500 to-green-600",
  amber: "bg-gradient-to-r from-amber-500 to-yellow-600",
  red: "bg-gradient-to-r from-red-500 to-pink-600",
  indigo: "bg-gradient-to-r from-indigo-500 to-blue-600", 
  pink: "bg-gradient-to-r from-pink-500 to-rose-600",
  multi: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
};

const fontSizeClasses: Record<HeadingLevel, string> = {
  h1: "text-3xl sm:text-4xl font-bold",
  h2: "text-2xl sm:text-3xl font-bold",
  h3: "text-xl sm:text-2xl font-bold",
  h4: "text-lg sm:text-xl font-semibold",
  h5: "text-base sm:text-lg font-semibold",
  h6: "text-sm sm:text-base font-medium",
};

interface GradientHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: GradientVariant;
  as?: HeadingLevel;
  className?: string;
}

const GradientHeading = React.forwardRef<
  HTMLHeadingElement,
  GradientHeadingProps
>(({ variant = "primary", as = "h1", className, ...props }, ref) => {
  const Component = as;
  return (
    <Component
      ref={ref}
      className={cn(
        gradientClasses[variant],
        fontSizeClasses[as],
        "bg-clip-text text-transparent tracking-tight",
        className
      )}
      {...props}
    />
  );
});
GradientHeading.displayName = "GradientHeading";

export { GradientHeading };
