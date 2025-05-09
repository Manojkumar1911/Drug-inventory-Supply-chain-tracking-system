
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sample knowledge base for pharmacy inventory management
const knowledgeBase = {
  // General system questions
  "how to use": "Navigate through the sidebar menu to access different sections like Inventory, Transfers, and Reports. The dashboard gives you a quick overview of your pharmacy inventory status.",
  "features": "PharmaLink system features include inventory tracking, transfer management, expiry date alerts, low stock notifications, reporting, and AI-assisted insights.",
  "dashboard": "The dashboard provides a summary of your inventory status, including low stock alerts, expiring items, and recent transfers.",
  
  // Inventory management
  "add product": "To add a new product, go to the Products page and click on the 'Add Product' button. Fill in the required information and submit the form.",
  "update product": "To update product details, find the product in the Products page, click on the edit icon, make your changes, and click 'Save'.",
  "delete product": "To delete a product, find it in the Products page, click on the delete icon, and confirm your action. Note that this cannot be undone.",
  "reorder level": "Reorder level is the minimum quantity of a product that should trigger a restock alert. Set this based on usage patterns and lead times.",
  
  // Transfers
  "create transfer": "To create a transfer, go to the Transfers page and click 'New Transfer'. Select the source location, destination, products, and quantities, then submit.",
  "transfer status": "Transfer status can be 'Pending Approval', 'In Transit', or 'Completed'. You can update the status from the Transfers page.",
  "approve transfer": "To approve a transfer, find it in the Transfers page, click on the action menu, and select 'Approve'. You need appropriate permissions.",
  
  // Alerts
  "stock alert": "Stock alerts are triggered when product quantities fall below their reorder levels. You can view these on the Alerts page or dashboard.",
  "expiry alert": "Expiry alerts are triggered for products approaching their expiration date. Configure the advance warning period in Settings.",
  "disable alerts": "You can temporarily disable specific alert types in the Settings page under the 'Notifications' section.",
  
  // Reports
  "generate report": "To generate reports, go to the Analytics page, select the report type, date range, and other filters, then click 'Generate Report'.",
  "export data": "To export data, generate the desired report first, then click the 'Export' button to download as CSV or PDF.",
  "smart reports": "Smart Reports use AI to analyze your inventory data and provide insights. Access them from the Analytics page under 'AI Smart Reports'.",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Query parameter is required" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // First, check our knowledge base for specific answers
    const normalizedQuery = query.toLowerCase().trim();
    
    // Find the best matching response from knowledge base
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (normalizedQuery.includes(key)) {
        const score = key.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = value;
        }
      }
    }
    
    // If we have a good match, return it
    if (bestMatch && bestScore > 2) {
      return new Response(
        JSON.stringify({
          success: true,
          response: bestMatch,
          source: "knowledge_base"
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // If no specific match in knowledge base, generate a contextual response
    let response = "";
    
    // Check for common greeting patterns
    if (normalizedQuery.includes("hello") || normalizedQuery.includes("hi") || normalizedQuery.includes("hey")) {
      response = "Hello! How can I assist you with your pharmacy inventory management today?";
    } 
    // Check for help-related queries
    else if (normalizedQuery.includes("help") || normalizedQuery.includes("assist")) {
      response = "I can help you with inventory management, products, transfers, settings, and reporting features. What specific area do you need assistance with?";
    }
    // Check for inventory-related queries
    else if (normalizedQuery.includes("inventory") || normalizedQuery.includes("stock")) {
      response = "Our inventory management system helps you track products across locations, monitor stock levels, and receive alerts. You can manage your inventory from the Products section.";
    }
    // Check for reporting queries
    else if (normalizedQuery.includes("report") || normalizedQuery.includes("analytics")) {
      response = "PharmaLink offers comprehensive reporting features including inventory status, expiry tracking, transaction history, and AI-powered Smart Reports to help you make data-driven decisions.";
    }
    // Check for transfer-related queries
    else if (normalizedQuery.includes("transfer") || normalizedQuery.includes("move")) {
      response = "You can transfer products between locations through the Transfers section. Simply select source and destination locations, add products with quantities, and submit the transfer request.";
    }
    // General fallback response
    else {
      response = "I'm here to help with your pharmacy inventory management questions. You can ask about products, inventory, transfers, reports, or settings. How can I assist you today?";
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        response: response,
        source: "generated"
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
    
  } catch (error) {
    console.error("Error in AI chatbot function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to process query" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
