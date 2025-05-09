import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Bot, Send, User, X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Knowledge base with common pharmacy inventory management questions and answers
const knowledgeBase: Record<string, string> = {
  "features": "PharmaLink system features include inventory tracking, transfer management, expiry date alerts, low stock notifications, reporting, and AI-assisted insights.",
  "dashboard": "The dashboard provides a summary of your inventory status, including low stock alerts, expiring items, and recent transfers.",
  "add product": "To add a new product, go to the Products page and click on the 'Add Product' button. Fill in the required information and submit the form.",
  "update product": "To update product details, find the product in the Products page, click on the edit icon, make your changes, and click 'Save'.",
  "delete product": "To delete a product, find it in the Products page, click on the delete icon, and confirm your action. Note that this cannot be undone.",
  "stock alert": "Stock alerts are triggered when product quantities fall below their reorder levels. You can view these on the Alerts page or dashboard.",
  "expiry alert": "Expiry alerts are triggered for products approaching their expiration date. Configure the advance warning period in Settings.",
  "transfer": "To create a transfer, go to the Transfers page and click 'New Transfer'. Select the source location, destination, products, and quantities, then submit.",
  "report": "To generate reports, go to the Analytics page, select the report type, date range, and other filters, then click 'Generate Report'.",
  "export": "To export data, generate the desired report first, then click the 'Export' button to download as CSV or PDF.",
  "login": "To login, enter your email and password on the login page. If you forget your password, use the 'Forgot Password' link.",
  "supplier": "Manage your suppliers in the Suppliers page. You can add, edit, and view all your suppliers and their products.",
  "reorder": "The Reorder page shows products that need to be restocked. You can generate purchase orders directly from this page.",
  "settings": "In the Settings page, you can configure system preferences, user permissions, alerts, and integrations.",
};

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hello! I'm your PharmaLink assistant. How can I help you today? You can ask me about using the system, managing inventory, transfers, or reports.",
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
      // First try to find an answer in our knowledge base
      const response = await generateResponseFromKnowledgeBase(userMessage.content);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
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

  // This function generates a response from our local knowledge base
  const generateResponseFromKnowledgeBase = async (query: string): Promise<string> => {
    // Give a small artificial delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Convert query to lowercase for easier matching
    const normalizedQuery = query.toLowerCase();
    
    // Look for keywords in the knowledge base
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (normalizedQuery.includes(key)) {
        const score = key.length; // Longer matches are better
        if (score > bestScore) {
          bestScore = score;
          bestMatch = value;
        }
      }
    }
    
    // If we found a good match, return it
    if (bestMatch && bestScore > 2) {
      return bestMatch;
    }
    
    // Otherwise, return a generic response
    if (normalizedQuery.includes("hello") || normalizedQuery.includes("hi") || normalizedQuery.includes("hey")) {
      return "Hello! How can I assist you with your pharmacy inventory management today?";
    } else if (normalizedQuery.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    } else if (normalizedQuery.includes("how are you")) {
      return "I'm just a digital assistant, but I'm functioning well! How can I help you with PharmaLink today?";
    } else if (normalizedQuery.includes("help")) {
      return "I can help you with questions about inventory management, product information, transfers, reports, and general usage of the PharmaLink system. What would you like to know?";
    } else if (normalizedQuery.includes("inventory")) {
      return "Our inventory management system helps you track products across multiple locations, monitor stock levels, and get alerts for low stock or expiring items. You can view your inventory on the Products page.";
    } else if (normalizedQuery.includes("alert") || normalizedQuery.includes("notification")) {
      return "PharmaLink provides several types of alerts: low stock alerts when products fall below their reorder levels, expiry alerts for products nearing their expiration dates, and transfer recommendations to optimize inventory across locations.";
    } else if (normalizedQuery.includes("analytics") || normalizedQuery.includes("report")) {
      return "You can generate various reports in the Analytics section, including inventory summaries, expiry reports, transaction histories, and AI-powered Smart Reports that provide insights and recommendations based on your data.";
    }
    
    // Default response if no match is found
    return "I don't have specific information about that topic. You can ask me about inventory management, products, transfers, alerts, reports, or using the PharmaLink system.";
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        content: "Hello! I'm your PharmaLink assistant. How can I help you today? You can ask me about using the system, managing inventory, transfers, or reports.",
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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
      
      <div className="border-t p-4">
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
      </div>
    </div>
  );
};

export default AIChatbot;
