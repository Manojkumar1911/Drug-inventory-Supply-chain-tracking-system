
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  ShoppingCart, 
  ArrowLeftRight, 
  AlertCircle,
  Sparkles,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AlertActionsProps {
  className?: string;
}

const AlertActions: React.FC<AlertActionsProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);

  const checkAlerts = async (checkType: string) => {
    try {
      setIsLoading(checkType);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You need to be logged in to perform this action");
        return;
      }
      
      const response = await fetch("https://labzxhoshhzfixlzccrw.supabase.co/functions/v1/send-alert-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify({ checkType, emailRecipient: "manojinsta19@gmail.com" })
      });
      
      const result = await response.json();
      setLastResult(result);
      
      if (result.success) {
        switch (checkType) {
          case "expiry":
            toast.success(`Expiry alerts processed: Found ${result.results?.length || 0} products expiring soon.`, {
              description: `Notifications sent to manojinsta19@gmail.com`
            });
            break;
          case "stock":
            toast.success(`Low stock alerts processed: ${result.message}`, {
              description: `Notifications sent to manojinsta19@gmail.com`
            });
            break;
          case "transfers":
            toast.success(`Transfer recommendations processed: ${result.message}`, {
              description: result.recommendationsCount > 0 ? 
                `Created ${result.recommendationsCount} transfer recommendations` : 
                `No transfer recommendations needed at this time`
            });
            break;
          case "all":
            toast.success("All alerts and recommendations processed", {
              description: "Check logs for details"
            });
            break;
        }
      } else {
        // More detailed error handling
        let errorMessage = "Unknown error";
        if (result.error) {
          errorMessage = result.error;
        } else if (checkType === "all") {
          if (!result.stockChecks?.success) {
            errorMessage = `Stock alerts failed: ${result.stockChecks?.error || 'Unknown error'}`;
          } else if (!result.expiryChecks?.success) {
            errorMessage = `Expiry alerts failed: ${result.expiryChecks?.error || 'Unknown error'}`;
          } else if (!result.transferRecommendations?.success) {
            errorMessage = `Transfer recommendations failed: ${result.transferRecommendations?.error || 'Unknown error'}`;
          }
        }
        
        toast.error(`Failed to process ${checkType} alerts: ${errorMessage}`, {
          duration: 5000
        });
        
        console.error(`Error in ${checkType} alerts:`, result);
      }
    } catch (error) {
      console.error(`Error checking ${checkType} alerts:`, error);
      toast.error(`Failed to process ${checkType} alerts: Network error`);
    } finally {
      setIsLoading(null);
    }
  };

  // CSS classes for the button sparkle effect
  const buttonSparkleClass = "relative overflow-hidden after:content-[''] after:absolute after:w-full after:h-full after:left-0 after:top-0 after:bg-white after:opacity-0 after:mix-blend-screen hover:after:opacity-40 hover:after:transition-all hover:after:duration-700 after:animate-sparkle";

  return (
    <motion.div 
      className={`flex flex-wrap gap-3 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Button 
        variant="outline"
        className={`gap-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20 hover:shadow-glow-yellow transition-all duration-300 ${buttonSparkleClass}`}
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
            {lastResult?.expiryChecks?.success === true && <CheckCircle className="h-3 w-3 text-green-500 ml-1" />}
            {lastResult?.expiryChecks?.success === false && <XCircle className="h-3 w-3 text-red-500 ml-1" />}
          </>
        )}
      </Button>
      
      <Button 
        variant="outline"
        className={`gap-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 hover:shadow-glow-red transition-all duration-300 ${buttonSparkleClass}`}
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
            {lastResult?.stockChecks?.success === true && <CheckCircle className="h-3 w-3 text-green-500 ml-1" />}
            {lastResult?.stockChecks?.success === false && <XCircle className="h-3 w-3 text-red-500 ml-1" />}
          </>
        )}
      </Button>
      
      <Button 
        variant="outline"
        className={`gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 hover:shadow-blue-primary transition-all duration-300 ${buttonSparkleClass}`}
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
            {lastResult?.transferRecommendations?.success === true && <CheckCircle className="h-3 w-3 text-green-500 ml-1" />}
            {lastResult?.transferRecommendations?.success === false && <XCircle className="h-3 w-3 text-red-500 ml-1" />}
          </>
        )}
      </Button>
      
      <Button 
        variant="outline"
        className={`gap-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 hover:from-purple-500/20 hover:to-violet-500/20 hover:shadow-glow-purple transition-all duration-300 ${buttonSparkleClass}`}
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
            {lastResult?.success === true && <CheckCircle className="h-3 w-3 text-green-500 ml-1" />}
            {lastResult?.success === false && <XCircle className="h-3 w-3 text-red-500 ml-1" />}
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default AlertActions;
