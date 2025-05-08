
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sample knowledge base for pharmacy inventory management
const knowledgeBase = {
  // General system questions
  "how to use": "Navigate through the sidebar menu to access different sections like Inventory, Transfers, and Reports. The dashboard gives you a quick overview of your pharmacy inventory status.",
  "features": "PharmInventory system features include inventory tracking, transfer management, expiry date alerts, low stock notifications, reporting, and AI-assisted insights.",
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
  
  // Locations
  "add location": "To add a new location, go to the Locations page and click 'Add Location'. Enter the required details and save.",
  "location types": "Location types include Pharmacy, Warehouse, Distribution Center, and Clinic. Each can have different settings.",
  
  // Users and permissions
  "add user": "To add a new user, go to the Users page and click 'Add User'. Provide their email, assign a role, and they'll receive an invitation.",
  "user roles": "User roles include Admin, Manager, Staff, and Viewer. Each role has different permissions within the system.",
  "reset password": "Users can reset their password by clicking 'Forgot Password' on the login screen. Admins can also reset passwords from the Users page."
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
    
    // Normalize the query by making it lowercase and removing extra spaces
    const normalizedQuery = query.toLowerCase().trim();
    
    // Find the best matching response
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (normalizedQuery.includes(key)) {
        // Simple scoring based on the length of the matching key
        // Longer matches are better as they're more specific
        const score = key.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = value;
        }
      }
    }
    
    // Default response if no good match
    if (!bestMatch) {
      bestMatch = "I don't have specific information about that. Could you try asking in a different way or about a different topic? You can ask about inventory management, transfers, alerts, reports, or user management.";
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        response: bestMatch,
        query: query
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
