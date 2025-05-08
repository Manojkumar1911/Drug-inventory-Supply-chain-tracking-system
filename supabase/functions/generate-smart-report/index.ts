
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Parse request body or use default parameters
    const { reportType = "inventory_summary", timeframe = "week", location = null } = await req.json();
    
    // Initialize results
    let data = [];
    let insights = [];
    let summary = "";
    
    // Fetch relevant data based on report type
    if (reportType === "inventory_summary") {
      // Get inventory totals by category
      const { data: inventoryData, error: inventoryError } = await supabaseClient
        .from("products")
        .select("category, quantity")
        .order("category");
      
      if (inventoryError) throw inventoryError;
      
      // Process inventory data for reporting
      const categoryTotals = inventoryData.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = 0;
        acc[item.category] += item.quantity;
        return acc;
      }, {});
      
      data = Object.keys(categoryTotals).map(category => ({
        category,
        total: categoryTotals[category]
      }));
      
      // Generate basic insights
      const totalInventory = Object.values(categoryTotals).reduce((sum: number, val: any) => sum + val, 0);
      const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
        categoryTotals[a] > categoryTotals[b] ? a : b
      );
      
      insights = [
        `Total inventory count: ${totalInventory} items`,
        `Largest category: ${topCategory} with ${categoryTotals[topCategory]} items`,
        `${Object.keys(categoryTotals).length} product categories in inventory`
      ];
      
      summary = `Inventory Report Summary: Your inventory has ${totalInventory} items across ${Object.keys(categoryTotals).length} categories. The ${topCategory} category has the highest stock level.`;
    } 
    else if (reportType === "low_stock") {
      // Get items below reorder level
      const { data: lowStockData, error: lowStockError } = await supabaseClient
        .from("products")
        .select("*")
        .lte("quantity", "reorder_level");
      
      if (lowStockError) throw lowStockError;
      
      data = lowStockData;
      
      // Generate insights
      const criticalItems = lowStockData.filter(item => item.quantity === 0).length;
      const urgentItems = lowStockData.filter(item => item.quantity <= item.reorder_level / 2).length;
      
      insights = [
        `${lowStockData.length} items below reorder threshold`,
        `${criticalItems} items completely out of stock`,
        `${urgentItems} items at critically low levels (below 50% of reorder level)`
      ];
      
      summary = `Low Stock Alert: You have ${lowStockData.length} items below reorder levels, including ${criticalItems} completely out of stock. Consider restocking soon to prevent shortages.`;
    }
    else if (reportType === "expiry") {
      // Get items expiring in the next 90 days
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
      
      const { data: expiryData, error: expiryError } = await supabaseClient
        .from("products")
        .select("*")
        .lt("expiry_date", ninetyDaysFromNow.toISOString())
        .gt("expiry_date", new Date().toISOString())
        .order("expiry_date");
      
      if (expiryError) throw expiryError;
      
      data = expiryData;
      
      // Generate insights
      const thirtyDays = expiryData.filter(item => {
        const expiry = new Date(item.expiry_date);
        const now = new Date();
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }).length;
      
      insights = [
        `${expiryData.length} products expiring in the next 90 days`,
        `${thirtyDays} products expiring within 30 days`,
        `Earliest expiring product: ${expiryData.length > 0 ? expiryData[0].name : 'None'}`
      ];
      
      summary = `Expiration Alert: ${expiryData.length} products will expire in the next 90 days, with ${thirtyDays} expiring within 30 days. Monitor these items to prevent waste.`;
    }
    else if (reportType === "transfers") {
      // Get recent transfers
      const { data: transfersData, error: transfersError } = await supabaseClient
        .from("transfers")
        .select("*")
        .order("transfer_date", { ascending: false })
        .limit(10);
      
      if (transfersError) throw transfersError;
      
      data = transfersData;
      
      // Calculate basic transfer stats
      const completed = transfersData.filter(t => t.status === "Completed").length;
      const pending = transfersData.filter(t => t.status === "Pending Approval").length;
      const inTransit = transfersData.filter(t => t.status === "In Transit").length;
      
      insights = [
        `${transfersData.length} recent transfers in the system`,
        `${completed} completed, ${inTransit} in transit, ${pending} pending approval`,
        `Most active location pair: ${transfersData.length > 0 ? `${transfersData[0].from_location} → ${transfersData[0].to_location}` : 'None'}`
      ];
      
      summary = `Transfer Status: You have ${pending} pending transfers awaiting approval and ${inTransit} transfers currently in transit. ${completed} transfers were recently completed.`;
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
        insights,
        summary,
        generatedAt: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error generating smart report:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to generate report" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
