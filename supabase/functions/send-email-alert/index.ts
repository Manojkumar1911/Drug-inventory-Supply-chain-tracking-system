
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

    const { product, recipient, allAlerts } = await req.json();
    
    // Check if we're sending a single product alert or multiple alerts
    if (allAlerts && Array.isArray(allAlerts) && allAlerts.length > 0) {
      // Handle multiple alerts in a single email
      return await sendCombinedAlertEmail(resend, allAlerts, recipient, corsHeaders);
    } else if (product) {
      // Handle single product alert
      return await sendSingleProductAlert(resend, product, recipient, corsHeaders);
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No valid alert data provided" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
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

async function sendSingleProductAlert(resend, product, recipient, corsHeaders) {
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
}

async function sendCombinedAlertEmail(resend, alerts, recipient, corsHeaders) {
  // Set default recipient for testing if none provided
  const to = recipient || "manojinsta19@gmail.com"; 
  
  // Group alerts by type
  const expiryAlerts = alerts.filter(alert => alert.type === 'expiry');
  const stockAlerts = alerts.filter(alert => alert.type === 'stock');
  const transferAlerts = alerts.filter(alert => alert.type === 'transfer');
  
  // Generate HTML for expiry alerts
  let expiryAlertsHtml = '';
  if (expiryAlerts.length > 0) {
    expiryAlertsHtml = `
      <h3 style="color: #ef4444; border-bottom: 1px solid #ef4444; padding-bottom: 8px;">Expiry Alerts (${expiryAlerts.length})</h3>
      <div style="margin-bottom: 20px;">
        ${expiryAlerts.map(alert => {
          const daysUntilExpiry = Math.ceil((new Date(alert.product.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          return `
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #ef4444;">
              <h4 style="margin-top: 0; color: #4f46e5;">${alert.product.name}</h4>
              <ul style="padding-left: 20px;">
                <li><strong>SKU:</strong> ${alert.product.sku}</li>
                <li><strong>Expiry Date:</strong> ${new Date(alert.product.expiry_date).toLocaleDateString()}</li>
                <li><strong>Days Until Expiry:</strong> <span style="color: ${daysUntilExpiry < 30 ? '#ef4444' : '#f59e0b'}">${daysUntilExpiry}</span></li>
                <li><strong>Current Quantity:</strong> ${alert.product.quantity} ${alert.product.unit}</li>
                <li><strong>Location:</strong> ${alert.product.location}</li>
              </ul>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  // Generate HTML for stock alerts
  let stockAlertsHtml = '';
  if (stockAlerts.length > 0) {
    stockAlertsHtml = `
      <h3 style="color: #f59e0b; border-bottom: 1px solid #f59e0b; padding-bottom: 8px;">Low Stock Alerts (${stockAlerts.length})</h3>
      <div style="margin-bottom: 20px;">
        ${stockAlerts.map(alert => {
          return `
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #f59e0b;">
              <h4 style="margin-top: 0; color: #4f46e5;">${alert.product.name}</h4>
              <ul style="padding-left: 20px;">
                <li><strong>SKU:</strong> ${alert.product.sku}</li>
                <li><strong>Current Quantity:</strong> ${alert.product.quantity} ${alert.product.unit}</li>
                <li><strong>Reorder Level:</strong> ${alert.product.reorder_level}</li>
                <li><strong>Location:</strong> ${alert.product.location}</li>
              </ul>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  // Generate HTML for transfer recommendations
  let transferAlertsHtml = '';
  if (transferAlerts.length > 0) {
    transferAlertsHtml = `
      <h3 style="color: #3b82f6; border-bottom: 1px solid #3b82f6; padding-bottom: 8px;">Transfer Recommendations (${transferAlerts.length})</h3>
      <div style="margin-bottom: 20px;">
        ${transferAlerts.map(alert => {
          return `
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #3b82f6;">
              <h4 style="margin-top: 0; color: #4f46e5;">${alert.product.name}</h4>
              <ul style="padding-left: 20px;">
                <li><strong>SKU:</strong> ${alert.product.sku}</li>
                <li><strong>From Location:</strong> ${alert.from_location} (${alert.from_quantity} ${alert.product.unit})</li>
                <li><strong>To Location:</strong> ${alert.to_location} (${alert.to_quantity} ${alert.product.unit})</li>
                <li><strong>Recommended Transfer:</strong> ${alert.recommended_quantity} ${alert.product.unit}</li>
              </ul>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  // Prepare email data for Resend API
  const emailData = {
    from: "alerts@pharmalink.com",
    to: [to],
    subject: `PharmaLink Alert Summary: ${new Date().toLocaleDateString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: linear-gradient(to right, #8b5cf6, #6366f1); padding: 15px; border-radius: 6px 6px 0 0;">
          <h2 style="color: white; margin: 0; padding: 0;">🚨 PharmaLink Alert Summary</h2>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>This is an automated notification with a summary of all current alerts in your inventory system:</p>
          
          ${expiryAlertsHtml}
          ${stockAlertsHtml}
          ${transferAlertsHtml}
          
          <p>Please take appropriate action for these alerts.</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">This is an automated notification from the PharmaLink Inventory Management System.</p>
          </div>
        </div>
      </div>
    `
  };
  
  console.log("Sending combined alert email");

  // Send email using Resend API
  const { data, error } = await resend.emails.send(emailData);
  
  if (error) {
    throw new Error(`Failed to send combined alert email: ${error.message}`);
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "Combined alert email sent successfully",
      emailId: data?.id,
      alertsSent: alerts.length
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}
