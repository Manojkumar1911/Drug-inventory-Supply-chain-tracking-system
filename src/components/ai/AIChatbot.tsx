
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Send, User, XCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hello! I'm your PharmInventory assistant. How can I help you today? You can ask me about using the system, managing inventory, transfers, or reports.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Still allow usage without auth, just show a message
        toast.info("For personalized assistance, please log in", {
          description: "Some features may be limited in guest mode"
        });
      }
      
      const response = await supabase.functions.invoke("ai-chatbot", {
        body: {
          query: userMessage.content
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to get response");
      }
      
      if (response.data.success) {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          content: response.data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(`Couldn't get a response: ${error.message}`);
      
      // Add fallback response
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: "I'm sorry, I'm having trouble connecting to the server. Please try again later or contact support if the issue persists.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        content: "Hello! I'm your PharmInventory assistant. How can I help you today? You can ask me about using the system, managing inventory, transfers, or reports.",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
              <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle>PharmInventory Assistant</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="h-8 text-muted-foreground"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto py-4 px-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo-100 text-indigo-800">AI</AvatarFallback>
                  <AvatarImage src="/placeholder.svg" alt="AI" />
                </Avatar>
              )}
              
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-50 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">You</AvatarFallback>
                  <AvatarImage src="/placeholder.svg" alt="User" />
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-indigo-100 text-indigo-800">AI</AvatarFallback>
              </Avatar>
              <div className="rounded-2xl px-4 py-3 max-w-[80%] bg-muted">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIChatbot;
