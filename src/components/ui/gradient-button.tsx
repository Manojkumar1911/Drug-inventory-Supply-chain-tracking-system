
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

type GradientVariant = 
  | "primary"
  | "purple"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "destructive"
  | "indigo"
  | "pink";

interface GradientButtonProps extends ButtonProps {
  gradientVariant?: GradientVariant;
  glowEffect?: boolean;
}

// Enhanced gradient classes for more vibrant colors
const gradientClasses: Record<GradientVariant, string> = {
  primary: "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground",
  purple: "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white",
  blue: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white",
  green: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white",
  amber: "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white",
  red: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white",
  destructive: "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white",
  indigo: "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white",
  pink: "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white",
};

// Enhanced glow effects
const glowClasses: Record<GradientVariant, string> = {
  primary: "hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]",
  purple: "hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
  blue: "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  green: "hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]",
  amber: "hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]",
  red: "hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]",
  destructive: "hover:shadow-[0_0_15px_rgba(225,29,72,0.5)]",
  indigo: "hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]",
  pink: "hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]",
};

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradientVariant = "primary", glowEffect = true, variant = "default", ...props }, ref) => {
    return (
      <Button
        className={cn(
          variant === "default" && gradientClasses[gradientVariant],
          glowEffect && variant === "default" && glowClasses[gradientVariant],
          "transition-all duration-300 relative after:content-[''] after:absolute after:inset-0 after:z-[-1] after:opacity-0 after:transition-all after:duration-300 hover:after:opacity-30 after:bg-white/20 after:blur-xl",
          className
        )}
        variant={variant}
        ref={ref}
        {...props}
      />
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton };
