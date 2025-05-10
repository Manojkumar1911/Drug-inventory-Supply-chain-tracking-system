
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Bot, Send, User, X, Search } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Expanded knowledge base with more comprehensive pharmacy inventory management answers
const knowledgeBase: Record<string, string> = {
  // General system questions
  "features": "PharmaLink system features include real-time inventory tracking across multiple locations, smart reorder recommendations, expiry date alerts, low stock notifications, comprehensive reporting, and AI-assisted insights.",
  "dashboard": "The dashboard provides a comprehensive summary of your inventory status, including low stock alerts, expiring items, recent transfers, and visual indicators of inventory health by category.",
  "what can you do": "I can help you with information about PharmaLink's features, guide you on how to use the system, answer questions about inventory management, explain notifications and alerts, and provide assistance with reports and analytics.",
  
  // Inventory management
  "add product": "To add a new product, navigate to the Products page and click the 'Add Product' button. Fill in essential details like name, SKU, category, quantity, unit, reorder level, and location. You can also add optional information like supplier, expiry date, and pricing.",
  "update product": "To update product details, locate the product in the Products page, click the edit icon next to the item you want to modify, make your changes in the form that appears, and click 'Save' to update the product information.",
  "delete product": "To delete a product, find it in the Products page, click on the delete icon next to the item, and confirm the deletion in the dialog box. Note that this action cannot be undone and will permanently remove the product from your inventory.",
  "reorder level": "The reorder level is the minimum quantity threshold that triggers a restock alert. Set this based on your usage patterns, lead times from suppliers, and how critical the item is. When stock falls below this level, the system will generate an alert.",
  "expiry date": "PharmaLink tracks product expiry dates and provides alerts for items approaching expiration. You'll see these alerts on your dashboard and Alerts page. You can configure how far in advance you want to be notified in Settings.",
  "search product": "To search for products, use the search bar at the top of the Products page. You can search by name, SKU, category, or location. The search results will update instantly as you type.",
  
  // Transfers
  "create transfer": "To create a transfer, navigate to the Transfers page and click 'New Transfer'. Select the source location, destination, products, and quantities to be transferred, then submit the request. Transfers require approval before they're completed.",
  "transfer status": "Transfer statuses include 'Pending Approval' (awaiting authorization), 'In Transit' (approved and in process of being moved), or 'Completed' (transfer has been received and inventory updated). You can view and update statuses from the Transfers page.",
  "approve transfer": "To approve a transfer, go to the Transfers page, find the pending transfer, click on the action menu, and select 'Approve'. You need appropriate permissions to approve transfers. Once approved, inventory quantities will be adjusted accordingly.",
  "transfer history": "Transfer history can be viewed on the Transfers page by selecting the 'History' tab. This shows all completed transfers with details including source, destination, products, quantities, and completion dates.",
  
  // Alerts
  "stock alert": "Stock alerts trigger when product quantities fall below their reorder levels. These are visible on the Alerts page and dashboard. Each alert shows the product name, current quantity, reorder level, and recommended order quantity.",
  "expiry alert": "Expiry alerts notify you when products are approaching their expiration dates. Configure the advance warning period in Settings. These alerts help prevent waste and ensure you dispense older stock first.",
  "disable alerts": "You can temporarily disable specific alert types in the Settings page under 'Notifications'. This can be done globally or for specific products. However, it's recommended to keep alerts enabled for better inventory management.",
  "alert notifications": "PharmaLink can send alerts via email and in-app notifications. Configure your notification preferences in the Settings page under 'Notifications'. You can choose which types of alerts you want to receive and through which channels.",
  
  // Reports & Analytics
  "generate report": "To generate reports, go to the Analytics page, select the report type (inventory, expiry, transactions, etc.), specify a date range and other filters, then click 'Generate Report'. Reports can be viewed online or exported.",
  "export data": "To export data, first generate the desired report in the Analytics section, then click the 'Export' button to download in CSV or PDF format. This is useful for offline analysis or sharing information with stakeholders.",
  "smart reports": "Smart Reports use AI to analyze your inventory data and provide actionable insights. Access them from the AI Features page under 'AI Smart Reports'. These reports identify trends, potential issues, and optimization opportunities.",
  "inventory analytics": "Inventory analytics provide insights into stock levels, turnover rates, slow-moving items, and category performance. Access these analytics from the Analytics page to make data-driven decisions about your inventory management.",
  
  // Suppliers
  "manage suppliers": "Manage your suppliers in the Suppliers page. You can add new suppliers, edit existing ones, and view all associated products. Each supplier profile includes contact information, lead times, and ordering history.",
  "add supplier": "To add a supplier, go to the Suppliers page and click 'Add Supplier'. Fill in the required information including name, contact details, address, lead time, and minimum order amount, then click 'Add'.",
  "supplier performance": "Supplier performance metrics are available in the Analytics section under 'Supplier Reports'. These metrics include on-time delivery rates, order accuracy, price comparisons, and lead time consistency.",
  
  // Locations
  "manage locations": "Manage your pharmacy locations in the Locations page. You can add new locations, edit existing ones, and view inventory levels at each location. This helps optimize stock distribution across multiple sites.",
  "add location": "To add a location, navigate to the Locations page and click 'Add Location'. Enter the location name, address, contact information, and any location-specific settings, then click 'Add' to create the new location.",
  
  // Reorder
  "reorder process": "The reorder process starts on the Reorder page which shows all products below their reorder levels. You can select items to reorder, adjust quantities, and generate purchase orders that can be sent directly to suppliers.",
  "purchase orders": "Purchase orders are created from the Reorder or Purchase Orders page. Select the products to order, specify quantities, choose suppliers, and generate the PO. You can track the status of purchase orders from receipt to delivery.",
  
  // Users & Permissions
  "user management": "User management is handled in the Users page. You can add new users, assign roles, set permissions, and deactivate accounts when necessary. Different role levels control what features each user can access.",
  "roles permissions": "PharmaLink offers several user roles including Admin, Manager, Staff, and Viewer. Each role has different permission levels. Admins can customize role permissions in the Settings page under 'User Roles'.",
  
  // Settings
  "system settings": "System settings can be configured in the Settings page. This includes notification preferences, default units, reorder calculation methods, auto-generation rules for SKUs, and integration settings for external systems.",
  "email settings": "Email settings can be configured in the Settings page under 'Notifications'. Enter the email addresses for different types of alerts, customize email templates, and set frequency preferences for email notifications.",
  
  // AI Features
  "ai assistant": "The AI Assistant (that's me!) can answer questions about the PharmaLink system, help you find information, and guide you through various processes. I can also provide insights about inventory management best practices.",
  "ai features": "PharmaLink offers two main AI features: Smart Reports and AI Assistant. Smart Reports analyze your inventory data to provide actionable insights and recommendations, while the AI Assistant helps answer questions and guide you through the system.",
  "smart recommendations": "Smart recommendations are AI-generated suggestions based on your inventory data. These appear on your dashboard and in Smart Reports, suggesting optimal stock levels, identifying potential waste, and recommending transfers between locations.",
};

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hello! I'm your PharmaLink assistant. How can I help you today? You can ask me about using the system, managing inventory, transfers, reports, or any other features of PharmaLink.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
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
        content: "I'm sorry, I'm having trouble processing your question. Could you please try rephrasing or ask something else about PharmaLink?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // More sophisticated matching algorithm for knowledge base
  const generateResponseFromKnowledgeBase = async (query: string): Promise<string> => {
    // Give a small artificial delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Normalize query - convert to lowercase and remove punctuation
    const normalizedQuery = query.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    
    // Array of words to remove from the search query
    const stopWords = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'have', 'has', 'had', 
                    'do', 'does', 'did', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
                    'and', 'or', 'but', 'if', 'then', 'else', 'when', 'where', 'why', 'how'];
    
    // Filter out stop words from the query
    const queryWords = normalizedQuery.split(' ').filter(word => !stopWords.includes(word));
    
    // Look for the best matching entry in the knowledge base
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [key, value] of Object.entries(knowledgeBase)) {
      const keyWords = key.toLowerCase().split(' ');
      let score = 0;
      
      // Calculate match score based on number of matching words
      for (const queryWord of queryWords) {
        // Exact key match has highest priority
        if (key.toLowerCase().includes(queryWord)) {
          score += 5;
        }
        
        // Individual word matches in key have medium priority
        for (const keyWord of keyWords) {
          if (keyWord === queryWord) {
            score += 3;
          } else if (keyWord.includes(queryWord) || queryWord.includes(keyWord)) {
            score += 1;
          }
        }
        
        // Content match has lower priority but still valuable
        if (value.toLowerCase().includes(queryWord)) {
          score += 0.5;
        }
      }
      
      // Prioritize complete keys that match multiple query words
      if (score > bestScore) {
        bestScore = score;
        bestMatch = value;
      }
    }
    
    // If we found a good match, return it
    if (bestMatch && bestScore > 2) {
      return bestMatch;
    }
    
    // Check for general question types
    if (normalizedQuery.includes("hello") || normalizedQuery.includes("hi") || normalizedQuery.includes("hey") || normalizedQuery.includes("greetings")) {
      return "Hello! I'm your PharmaLink assistant. How can I help you with your pharmacy inventory management today?";
    } else if (normalizedQuery.includes("thank")) {
      return "You're welcome! If you have any other questions about PharmaLink, feel free to ask. I'm here to help!";
    } else if (normalizedQuery.includes("how are you")) {
      return "I'm just a digital assistant, but I'm functioning well! How can I help you with PharmaLink today?";
    } else if (normalizedQuery.includes("help") || normalizedQuery.includes("assist")) {
      return "I can help you with questions about inventory management, products, transfers, reports, suppliers, locations, users, and all other aspects of PharmaLink. What would you like to know more about?";
    } else if (normalizedQuery.includes("who are you") || normalizedQuery.includes("what are you")) {
      return "I'm the PharmaLink AI Assistant, designed to help you use the PharmaLink system effectively. I can answer questions about inventory management, guide you through features, and provide assistance with any aspect of the platform.";
    } else if (normalizedQuery.includes("inventory") || normalizedQuery.includes("stock")) {
      return "PharmaLink's inventory management system helps you track products across multiple locations, monitor stock levels, and get alerts for low stock or expiring items. You can view your complete inventory on the Products page, generate inventory reports in Analytics, and see critical items directly on your Dashboard.";
    } else if (normalizedQuery.includes("report") || normalizedQuery.includes("analytic")) {
      return "PharmaLink offers comprehensive reporting features including inventory status reports, expiry tracking, transaction history, and AI-powered Smart Reports. Generate reports from the Analytics page by selecting the report type, date range, and any other filters you need.";
    } else if (normalizedQuery.includes("transfer") || normalizedQuery.includes("move")) {
      return "You can transfer products between locations through the Transfers page. Simply select source and destination locations, add products with quantities, and submit the transfer request. Transfers require approval before inventory is adjusted at both locations.";
    } else if (normalizedQuery.includes("supplier") || normalizedQuery.includes("vendor")) {
      return "Manage your suppliers in the Suppliers page where you can add new suppliers, edit existing ones, and view all associated products. You can track supplier performance, manage contact information, and generate purchase orders directly to specific suppliers.";
    } else if (normalizedQuery.includes("ai") || normalizedQuery.includes("smart")) {
      return "PharmaLink has two AI-powered features: Smart Reports and the AI Assistant (that's me!). Smart Reports analyze your inventory data to provide insights and recommendations, while I can answer questions and guide you through the system.";
    } else if (normalizedQuery.includes("setting") || normalizedQuery.includes("configure") || normalizedQuery.includes("preference")) {
      return "System settings can be configured in the Settings page. This includes notification preferences, default units, reorder calculation methods, user roles and permissions, and integration settings for external systems.";
    }
    
    // If nothing specific matched, provide a general response
    return "I don't have specific information about that topic yet. You can ask me about inventory management, products, transfers, alerts, reports, suppliers, locations, users, or settings in the PharmaLink system. Would you like me to help you with any of these areas?";
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        content: "Hello! I'm your PharmaLink assistant. How can I help you today? You can ask me about using the system, managing inventory, transfers, reports, or any other features of PharmaLink.",
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
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter(msg => 
            searchQuery === '' || 
            msg.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${
              searchQuery && message.content.toLowerCase().includes(searchQuery.toLowerCase()) 
                ? 'bg-yellow-100/20 dark:bg-yellow-900/20 p-1 rounded-lg' 
                : ''
            }`}
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
        <div className="flex justify-between mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat} 
            className="text-sm text-muted-foreground"
          >
            Clear conversation
          </Button>
        </div>
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
