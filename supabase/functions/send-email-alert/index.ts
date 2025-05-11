
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
    // Get the Resend API key from environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const resend = new Resend(resendApiKey);

    const { product, recipient } = await req.json();
    
    if (!product) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Product information is required" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Set default recipient for testing if none provided
    const to = recipient || "manojinsta19@gmail.com"; 
    
    const daysUntilExpiry = Math.ceil((new Date(product.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    
    // Prepare email data for Resend API
    const emailData = {
      from: "alerts@pharmalink.com",
      to: [to],
      subject: `Product Expiring Soon: ${product.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background: linear-gradient(to right, #8b5cf6, #6366f1); padding: 15px; border-radius: 6px 6px 0 0;">
            <h2 style="color: white; margin: 0; padding: 0;">🚨 Product Expiration Alert</h2>
          </div>
          <div style="padding: 20px; background-color: #f9fafb;">
            <p>This is an automated notification to inform you that the following product will expire soon:</p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h3 style="margin-top: 0; color: #4f46e5;">${product.name}</h3>
              <ul style="padding-left: 20px;">
                <li><strong>SKU:</strong> ${product.sku}</li>
                <li><strong>Expiry Date:</strong> ${new Date(product.expiry_date).toLocaleDateString()}</li>
                <li><strong>Days Until Expiry:</strong> <span style="color: ${daysUntilExpiry < 30 ? '#ef4444' : '#f59e0b'}">${daysUntilExpiry}</span></li>
                <li><strong>Current Quantity:</strong> ${product.quantity} ${product.unit}</li>
                <li><strong>Location:</strong> ${product.location}</li>
              </ul>
            </div>
            <p>Please take appropriate action.</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">This is an automated notification from the PharmaLink Inventory Management System.</p>
            </div>
          </div>
        </div>
      `
    };
    
    console.log("Sending email with data:", JSON.stringify(emailData, null, 2));

    // Send email using Resend API
    const { data, error } = await resend.emails.send(emailData);
    
    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Alert email sent successfully",
        emailId: data?.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error sending email alert:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: error.message || "An unknown error occurred"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
