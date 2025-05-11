
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

const gradientClasses: Record<GradientVariant, string> = {
  primary: "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground",
  purple: "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-500/90 hover:to-violet-500/90 text-white",
  blue: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-500/90 hover:to-indigo-500/90 text-white",
  green: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-500/90 hover:to-green-500/90 text-white",
  amber: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-500/90 hover:to-yellow-500/90 text-white",
  red: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-500/90 hover:to-pink-500/90 text-white",
  destructive: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-600/90 hover:to-rose-600/90 text-white",
  indigo: "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-500/90 hover:to-blue-600/90 text-white",
  pink: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-500/90 hover:to-rose-500/90 text-white",
};

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
          "transition-all duration-300",
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
