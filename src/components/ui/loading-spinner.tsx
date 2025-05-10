
import React from "react";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "white" | "success" | "warning" | "danger";
  className?: string;
  thickness?: "thin" | "regular" | "thick";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
  thickness = "regular",
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
  };
  
  const thicknessClasses = {
    thin: "border-2",
    regular: "border-[3px]",
    thick: "border-4",
  };

  return (
    <div className={`${className}`}>
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} border-current ${thicknessClasses[thickness]} border-b-transparent`}
        data-testid="loading-spinner"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;
