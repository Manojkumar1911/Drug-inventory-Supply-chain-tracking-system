
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  ShoppingCart, 
  ArrowLeftRight, 
  AlertCircle,
  Sparkles
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
            toast.success("Expiry alerts sent successfully to manojinsta19@gmail.com");
            break;
          case "stock":
            toast.success("Low stock alerts sent successfully to manojinsta19@gmail.com");
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

  // CSS classes for the button sparkle effect
  const buttonSparkleClass = "relative overflow-hidden after:content-[''] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:bg-white after:opacity-0 after:mix-blend-screen hover:after:opacity-40 hover:after:transition-all hover:after:duration-700 after:animate-sparkle";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button 
        variant="outline"
        className={`gap-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20 hover:shadow-md transition-all duration-300 ${buttonSparkleClass}`}
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
        className={`gap-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 hover:shadow-md transition-all duration-300 ${buttonSparkleClass}`}
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
        className={`gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 hover:shadow-md transition-all duration-300 ${buttonSparkleClass}`}
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
        className={`gap-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 hover:from-purple-500/20 hover:to-violet-500/20 hover:shadow-md transition-all duration-300 ${buttonSparkleClass}`}
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
            <div className="relative">
              <AlertCircle className="h-4 w-4" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
            </div>
            Process All Alerts
          </>
        )}
      </Button>
    </div>
  );
};

export default AlertActions;
