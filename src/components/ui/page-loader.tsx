
import React from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "./loading-spinner";

interface PageLoaderProps {
  message?: string;
  submessage?: string;
  variant?: "default" | "minimal" | "fullscreen";
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Loading...",
  submessage,
  variant = "default"
}) => {
  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="md" color="gradient" variant="dots" />
        <span className="ml-3 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {message}
        </span>
      </div>
    );
  }

  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <motion.div 
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute animate-ping opacity-75 rounded-full h-16 w-16 bg-purple-400 dark:bg-purple-600"></div>
          <LoadingSpinner size="xl" color="gradient" className="relative" />
        </motion.div>
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {message}
          </p>
          {submessage && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {submessage}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div 
        className="relative flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <div className="absolute animate-ping opacity-75 rounded-full h-16 w-16 bg-purple-400 dark:bg-purple-600"></div>
        <LoadingSpinner size="xl" color="gradient" className="relative" />
      </motion.div>
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {message}
        </p>
        {submessage && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {submessage}
          </p>
        )}
        <div className="mt-4 flex justify-center items-center gap-2">
          <motion.div 
            className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse" 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          />
          <motion.div 
            className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse" 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div 
            className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse" 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PageLoader;
