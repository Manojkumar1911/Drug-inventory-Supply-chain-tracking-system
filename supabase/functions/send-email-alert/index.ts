
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@0.16.0";

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
    // Get the resend API key from environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    const resend = new Resend(resendApiKey);
    const { product, recipient } = await req.json();
    
    if (!product || !recipient) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Product and recipient information are required" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // During testing, we'll only allow sending emails to the user's own email address
    // In production, you would verify a domain and use your own domain for sending emails
    const from = "alerts@pharmalink.com"; // This should be changed to a verified domain in production
    
    const daysUntilExpiry = Math.ceil((new Date(product.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    
    const emailData = {
      from: from,
      to: [recipient],
      subject: `Product Expiring Soon: ${product.name}`,
      html: `
        <h2>Product Expiration Alert</h2>
        <p>This is an automated notification to inform you that the following product will expire soon:</p>
        <ul>
          <li><strong>Product Name:</strong> ${product.name}</li>
          <li><strong>SKU:</strong> ${product.sku}</li>
          <li><strong>Expiry Date:</strong> ${new Date(product.expiry_date).toLocaleDateString()}</li>
          <li><strong>Days Until Expiry:</strong> ${daysUntilExpiry}</li>
          <li><strong>Current Quantity:</strong> ${product.quantity} ${product.unit}</li>
          <li><strong>Location:</strong> ${product.location}</li>
        </ul>
        <p>Please take appropriate action.</p>
      `
    };
    
    console.log("Sending email with data:", JSON.stringify(emailData, null, 2));

    // For testing purposes, we'll just log the email data instead of sending it
    // In a real environment, you would use the Resend API to send the email
    // const { data, error } = await resend.emails.send(emailData);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Alert email would be sent in production environment",
        emailData,
        note: "Email sending is simulated for testing; in production, uncomment the resend.emails.send line"
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
