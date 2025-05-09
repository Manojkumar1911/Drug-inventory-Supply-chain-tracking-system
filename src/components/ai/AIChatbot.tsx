import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Send, User, XCircle, MessageCircle, X } from "lucide-react";
import { cn } from '@/lib/utils';
import axios from 'axios';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const GEMINI_API_KEY = "AIzaSyBEH2mYFm2r8NTsfbPGea4vXY3QMF5xrJY";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
      // Using Gemini API instead of Supabase function
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful pharmacy inventory assistant. You help users with their inventory management, transfers, reports, and using the system. Answer the following question concisely and helpfully: ${userMessage.content}`
                }
              ]
            }
          ]
        }
      );

      if (response?.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const botResponse = response.data.candidates[0].content.parts[0].text;
        
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          content: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(`Couldn't get a response: ${error.message || "Unknown error"}`);
      
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

  // For floating chatbot button
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <>
      {/* Full chatbot for AI features page */}
      <Card className="hidden md:flex flex-col h-[600px] shadow-md border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-lg">
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

      {/* Mobile version */}
      <div className="md:hidden flex flex-col h-[500px] shadow-md border border-border rounded-md">
        {/* Rest of the mobile chatbot UI, similar to desktop version but optimized for smaller screens */}
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-full">
              <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-medium text-sm">PharmInventory Assistant</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="h-7 w-7 p-0"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span className="sr-only">Clear Chat</span>
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Similar messages rendering as desktop version, but with smaller sizes */}
          {/* ... Similar logic as desktop version for messages */}
          {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xs">AI</AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`rounded-xl px-3 py-1.5 max-w-[75%] ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-xs">{message.content}</p>
                  <p className="text-[10px] opacity-50 mt-0.5">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xs">AI</AvatarFallback>
                </Avatar>
                <div className="rounded-xl px-3 py-2 max-w-[75%] bg-muted">
                  <div className="flex space-x-1.5">
                    <div className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-3">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="text-xs h-8"
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white h-8 w-8 p-0"
            >
              {isLoading ? (
                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </form>
        </div>
      </div>
      
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {isOpen ? (
          <div className="flex flex-col bg-background border rounded-lg shadow-lg w-80 sm:w-96 h-[450px]">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo-100 text-indigo-800">AI</AvatarFallback>
                </Avatar>
                <span className="font-medium">PharmInventory Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChatbot}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xs">AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`rounded-xl px-3 py-1.5 max-w-[75%] ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-[10px] opacity-50 mt-0.5">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-indigo-100 text-indigo-800 text-xs">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-xl px-3 py-2 max-w-[75%] bg-muted">
                    <div className="flex space-x-1.5">
                      <div className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t p-2">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="text-xs"
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!input.trim() || isLoading}
                  variant="default"
                >
                  {isLoading ? (
                    <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <Button 
            onClick={toggleChatbot}
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="sr-only">Open chat</span>
          </Button>
        )}
      </div>
    </>
  );
};

export default AIChatbot;
