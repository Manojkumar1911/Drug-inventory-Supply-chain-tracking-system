
import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AIChatbot from './AIChatbot';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="bg-background border rounded-lg shadow-xl mb-3 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ width: '350px', height: '500px' }}
          >
            <div className="flex items-center justify-between p-3 border-b bg-primary/10">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-medium">PharmaLink AI Assistant</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-0 h-[calc(500px-52px)]">
              <AIChatbot />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        onClick={toggleChat} 
        size="icon" 
        className={`h-14 w-14 rounded-full shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'} transition-all duration-300`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default FloatingChatButton;
