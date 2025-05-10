
import React from "react";
import LoadingSpinner from "./loading-spinner";

interface PageLoaderProps {
  message?: string;
  submessage?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Loading...",
  submessage 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative flex flex-col items-center">
        <div className="absolute animate-ping opacity-75 rounded-full h-16 w-16 bg-purple-400 dark:bg-purple-600"></div>
        <LoadingSpinner size="xl" className="relative" />
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {message}
        </p>
        {submessage && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {submessage}
          </p>
        )}
        <div className="mt-4 flex justify-center items-center gap-2">
          <div className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          <div className="h-2 w-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
