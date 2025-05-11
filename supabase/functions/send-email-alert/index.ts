
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Get the MailSender API key from environment variables
    const mailSenderApiKey = Deno.env.get("MAILSENDER_API_KEY") || "mlsn.16d8959d58e1a06cb000a134adef684775f457668c54020f110ca070e68c40c4";
    if (!mailSenderApiKey) {
      throw new Error("MAILSENDER_API_KEY environment variable is not set");
    }

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

    // Set default recipient for testing
    const to = recipient || "manojinsta19@gmail.com"; 
    
    const daysUntilExpiry = Math.ceil((new Date(product.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    
    // Prepare email data for MailSender API
    const emailData = {
      from: "alerts@pharmalink.com",
      to: [to],
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

    // Send email using MailSender API
    const response = await fetch("https://api.mailsender.com/v1/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mailSenderApiKey}`
      },
      body: JSON.stringify(emailData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${result.message || response.statusText}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Alert email sent successfully",
        emailData,
        data: result
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
