
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  message?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  type?: 'spinner' | 'dots' | 'pulse';
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading...', 
  className,
  size = 'medium',
  type = 'spinner'
}) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={cn('flex space-x-2 justify-center items-center', sizeClasses[size])}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                style={{ width: size === 'small' ? 8 : size === 'medium' ? 12 : 16, height: size === 'small' ? 8 : size === 'medium' ? 12 : 16 }}
                animate={{
                  y: [0, -15, 0],
                  backgroundColor: ['#8b5cf6', '#6366f1', '#8b5cf6']
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            <motion.div
              className="absolute inset-0 rounded-full bg-indigo-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 0.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop'
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 0.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
                delay: 0.3
              }}
            />
          </div>
        );
      
      case 'spinner':
      default:
        return (
          <motion.div 
            className={cn('border-4 rounded-full', sizeClasses[size])}
            style={{
              borderColor: 'rgba(139, 92, 246, 0.3)',
              borderTopColor: '#8b5cf6',
              borderRightColor: '#6366f1',
            }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1, 
              ease: 'linear', 
              repeat: Infinity,
            }}
          />
        );
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[100px] p-8 w-full',
      className
    )}>
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderLoader()}
        
        {message && (
          <motion.p 
            className="mt-4 text-base text-gray-500 dark:text-gray-400 text-center font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default PageLoader;
