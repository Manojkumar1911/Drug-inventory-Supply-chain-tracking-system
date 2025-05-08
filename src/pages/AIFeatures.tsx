
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SmartReports from '@/components/ai/SmartReports';
import AIChatbot from '@/components/ai/AIChatbot';
import { Bot, Sparkles } from 'lucide-react';

const AIFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("smart-reports");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Features</h1>
        <p className="text-muted-foreground">
          Smart AI tools to help you manage your inventory and get answers about the system
        </p>
      </div>

      <Tabs
        defaultValue="smart-reports"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="smart-reports" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Smart Reports
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="smart-reports" className="mt-0">
          <SmartReports />
        </TabsContent>
        
        <TabsContent value="chatbot" className="mt-0">
          <AIChatbot />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIFeatures;
