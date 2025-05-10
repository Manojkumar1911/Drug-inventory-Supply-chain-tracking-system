
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "white" | "success" | "warning" | "danger" | "gradient";
  className?: string;
  thickness?: "thin" | "regular" | "thick";
  variant?: "spinner" | "dots" | "pulse";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
  thickness = "regular",
  variant = "spinner",
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-purple-600 dark:text-purple-400",
    secondary: "text-gray-400 dark:text-gray-600",
    white: "text-white",
    success: "text-green-600 dark:text-green-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
    gradient: "text-transparent bg-gradient-to-r from-purple-600 to-blue-400 bg-clip-text",
  };
  
  const thicknessClasses = {
    thin: "border-2",
    regular: "border-[3px]",
    thick: "border-4",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-2 items-center", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "rounded-full",
              color === "gradient" 
                ? "bg-gradient-to-r from-purple-600 to-blue-400" 
                : colorClasses[color].replace("text-", "bg-"),
              {
                "w-1.5 h-1.5": size === "xs",
                "w-2 h-2": size === "sm",
                "w-2.5 h-2.5": size === "md",
                "w-3 h-3": size === "lg",
                "w-4 h-4": size === "xl",
              }
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full",
            color === "gradient" 
              ? "bg-gradient-to-r from-purple-600 to-blue-400" 
              : colorClasses[color].replace("text-", "bg-")
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full",
            color === "gradient" 
              ? "bg-gradient-to-r from-purple-600 to-blue-400" 
              : colorClasses[color].replace("text-", "bg-")
          )}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.2,
          }}
        />
        <div
          className={cn(
            "relative h-full w-full rounded-full",
            color === "gradient" 
              ? "bg-gradient-to-r from-purple-600 to-blue-400" 
              : colorClasses[color].replace("text-", "bg-")
          )}
        />
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn(className)}>
      <motion.div
        className={cn(
          `animate-spin rounded-full ${sizeClasses[size]} border-current ${thicknessClasses[thickness]} border-b-transparent`,
          colorClasses[color]
        )}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        }}
        data-testid="loading-spinner"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;
