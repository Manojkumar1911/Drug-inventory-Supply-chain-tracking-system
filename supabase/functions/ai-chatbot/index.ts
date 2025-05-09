import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "AIzaSyBEH2mYFm2r8NTsfbPGea4vXY3QMF5xrJY";

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
    
    // Otherwise, use Gemini API for a more dynamic response
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are PharmaLink AI, a helpful pharmacy inventory assistant. Answer this question concisely and professionally: ${query}`
                }
              ]
            }
          ]
        }),
      }
    );
    
    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response from Gemini API");
    }
    
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse,
        source: "gemini"
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
