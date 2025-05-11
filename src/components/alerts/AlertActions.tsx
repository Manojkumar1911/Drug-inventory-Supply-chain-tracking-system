
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

      // Gather alert data based on the check type
      let alertsData;
      
      if (checkType === 'all') {
        // Prepare data for combined alerts in a single email
        const expiryProducts = await fetchExpiryAlerts();
        const stockProducts = await fetchLowStockProducts();
        const transferRecommendations = await fetchTransferRecommendations();
        
        alertsData = {
          allAlerts: [
            ...expiryProducts.map(product => ({ type: 'expiry', product })),
            ...stockProducts.map(product => ({ type: 'stock', product })),
            ...transferRecommendations.map(rec => ({ 
              type: 'transfer', 
              product: rec.product,
              from_location: rec.from_location,
              to_location: rec.to_location,
              from_quantity: rec.from_quantity,
              to_quantity: rec.to_quantity,
              recommended_quantity: rec.recommended_quantity
            }))
          ],
          emailRecipient: "manojinsta19@gmail.com"
        };
      } else {
        // Prepare data for single type of alert
        alertsData = { 
          checkType, 
          emailRecipient: "manojinsta19@gmail.com" 
        };
      }
      
      const response = await fetch("https://labzxhoshhzfixlzccrw.supabase.co/functions/v1/send-email-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`
        },
        body: JSON.stringify(alertsData)
      });
      
      const result = await response.json();
      setLastResult(result);
      
      if (result.success) {
        switch (checkType) {
          case "expiry":
            toast.success(`Expiry alerts processed successfully`, {
              description: `Email sent to manojinsta19@gmail.com`
            });
            break;
          case "stock":
            toast.success(`Low stock alerts processed successfully`, {
              description: `Email sent to manojinsta19@gmail.com`
            });
            break;
          case "transfers":
            toast.success(`Transfer recommendations processed successfully`, {
              description: `Email sent to manojinsta19@gmail.com`
            });
            break;
          case "all":
            toast.success(`All alerts processed successfully`, {
              description: `Email containing ${alertsData.allAlerts.length} alerts sent to manojinsta19@gmail.com`
            });
            break;
        }
      } else {
        toast.error(`Failed to process ${checkType} alerts: ${result.message || 'Unknown error'}`, {
          duration: 5000
        });
        
        console.error(`Error in ${checkType} alerts:`, result);
      }
    } catch (error) {
      console.error(`Error checking ${checkType} alerts:`, error);
      toast.error(`Failed to process ${checkType} alerts: ${error.message || 'Network error'}`);
    } finally {
      setIsLoading(null);
    }
  };

  // Function to fetch products expiring soon
  const fetchExpiryAlerts = async () => {
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      // Fix the query to not use raw
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .lt("expiry_date", thirtyDaysFromNow.toISOString())
        .gt("expiry_date", new Date().toISOString())
        .order("expiry_date", { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching expiry alerts:", error);
      return [];
    }
  };

  // Function to fetch low stock products
  const fetchLowStockProducts = async () => {
    try {
      // Query products where quantity is less than reorder_level
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .lt("quantity", "reorder_level")
        .order("quantity", { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      return [];
    }
  };

  // Function to fetch transfer recommendations
  const fetchTransferRecommendations = async () => {
    try {
      // Get all product locations with quantities
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, sku, unit, quantity, location, reorder_level');
      
      if (productsError) throw productsError;
      
      // Group products by SKU to identify same product in different locations
      const productsBySku: Record<string, any[]> = {};
      products?.forEach(product => {
        if (!productsBySku[product.sku]) {
          productsBySku[product.sku] = [];
        }
        productsBySku[product.sku].push(product);
      });
      
      // Find transfer opportunities (locations with excess vs. locations with low stock)
      const recommendations = [];
      
      Object.values(productsBySku).forEach(productsWithSameSku => {
        if (productsWithSameSku.length < 2) return; // Need at least 2 locations to transfer
        
        // Find low stock locations
        const lowStockLocations = productsWithSameSku.filter(
          p => p.quantity < p.reorder_level
        );
        
        // Find excess stock locations (has more than reorder level + buffer)
        const excessStockLocations = productsWithSameSku.filter(
          p => p.quantity > (p.reorder_level * 1.5) // 50% buffer
        );
        
        // Create recommendations for each low stock location
        lowStockLocations.forEach(lowStockProduct => {
          // Sort excess locations by quantity descending
          const sortedExcessLocations = [...excessStockLocations]
            .sort((a, b) => b.quantity - a.quantity);
          
          if (sortedExcessLocations.length > 0) {
            const excessLocation = sortedExcessLocations[0];
            const deficit = lowStockProduct.reorder_level - lowStockProduct.quantity;
            const excess = excessLocation.quantity - excessLocation.reorder_level;
            const transferAmount = Math.min(deficit, excess);
            
            if (transferAmount > 0) {
              recommendations.push({
                product: lowStockProduct,
                from_location: excessLocation.location,
                to_location: lowStockProduct.location,
                from_quantity: excessLocation.quantity,
                to_quantity: lowStockProduct.quantity,
                recommended_quantity: transferAmount
              });
            }
          }
        });
      });
      
      return recommendations;
    } catch (error) {
      console.error("Error generating transfer recommendations:", error);
      return [];
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
