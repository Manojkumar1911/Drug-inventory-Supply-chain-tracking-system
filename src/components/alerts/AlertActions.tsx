
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  ShoppingCart, 
  ArrowLeftRight, 
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AlertActionsProps {
  className?: string;
}

const AlertActions: React.FC<AlertActionsProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const checkAlerts = async (checkType: string) => {
    try {
      setIsLoading(checkType);
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch("https://labzxhoshhzfixlzccrw.supabase.co/functions/v1/send-alert-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify({ checkType })
      });
      
      const result = await response.json();
      
      if (result.success) {
        switch (checkType) {
          case "expiry":
            toast.success("Expiry alerts sent successfully");
            break;
          case "stock":
            toast.success("Low stock alerts sent successfully");
            break;
          case "transfers":
            toast.success("Transfer recommendations processed");
            break;
          case "all":
            toast.success("All alerts and recommendations processed");
            break;
        }
      } else {
        toast.error(`Failed to process ${checkType} alerts`);
      }
    } catch (error) {
      console.error(`Error checking ${checkType} alerts:`, error);
      toast.error(`Failed to process ${checkType} alerts`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button 
        variant="outline"
        className="gap-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20"
        onClick={() => checkAlerts('expiry')}
        disabled={!!isLoading}
      >
        {isLoading === 'expiry' ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
            Processing...
          </>
        ) : (
          <>
            <AlertTriangle className="h-4 w-4" />
            Send Expiry Alerts
          </>
        )}
      </Button>
      
      <Button 
        variant="outline"
        className="gap-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20"
        onClick={() => checkAlerts('stock')}
        disabled={!!isLoading}
      >
        {isLoading === 'stock' ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
            Processing...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Send Stock Alerts
          </>
        )}
      </Button>
      
      <Button 
        variant="outline"
        className="gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20"
        onClick={() => checkAlerts('transfers')}
        disabled={!!isLoading}
      >
        {isLoading === 'transfers' ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
            Processing...
          </>
        ) : (
          <>
            <ArrowLeftRight className="h-4 w-4" />
            Find Transfer Opportunities
          </>
        )}
      </Button>
      
      <Button 
        variant="outline"
        className="gap-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 hover:from-purple-500/20 hover:to-violet-500/20"
        onClick={() => checkAlerts('all')}
        disabled={!!isLoading}
      >
        {isLoading === 'all' ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
            Processing All...
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4" />
            Process All Alerts
          </>
        )}
      </Button>
    </div>
  );
};

export default AlertActions;
