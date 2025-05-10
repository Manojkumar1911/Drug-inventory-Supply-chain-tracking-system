
import React from "react";
import LoadingSpinner from "./loading-spinner";

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative flex flex-col items-center">
        <div className="absolute animate-ping opacity-75 rounded-full h-16 w-16 bg-purple-400"></div>
        <LoadingSpinner size="xl" className="relative" />
      </div>
      <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default PageLoader;
