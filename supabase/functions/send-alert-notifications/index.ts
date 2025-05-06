
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// Configure Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://labzxhoshhzfixlzccrw.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure Resend for email notifications
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

// Configure Twilio for SMS notifications
const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// This function sends an email notification using Resend
async function sendEmailNotification(recipient: string, subject: string, body: string) {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Drug Inventory System <inventory-alerts@yourdomain.com>",
        to: recipient,
        subject: subject,
        html: body,
      }),
    });

    const data = await response.json();
    console.log("Email sent:", data);
    return { success: response.ok, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

// This function sends an SMS notification using Twilio
async function sendSmsNotification(phoneNumber: string, message: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error("Twilio credentials not configured");
    return { success: false, error: "SMS service not configured" };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const formData = new URLSearchParams();
    formData.append("To", phoneNumber);
    formData.append("From", TWILIO_PHONE_NUMBER);
    formData.append("Body", message);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: formData.toString(),
    });

    const data = await response.json();
    console.log("SMS sent:", data);
    return { success: response.ok, data };
  } catch (error) {
    console.error("Failed to send SMS:", error);
    return { success: false, error };
  }
}

// This function creates a notification record in the database
async function createAlertInDatabase(product: any, daysUntilExpiry: number) {
  try {
    const { data, error } = await supabase.from("alerts").insert([
      {
        title: `Product Expiring Soon: ${product.name}`,
        description: `${product.name} (SKU: ${product.sku}) will expire in ${daysUntilExpiry} days.`,
        severity: daysUntilExpiry <= 30 ? "high" : "medium",
        category: "Expiry",
        location: product.location,
        status: "New",
      },
    ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Failed to create alert in database:", error);
    return { success: false, error };
  }
}

// This is the main function that checks for expiring products
async function checkExpiringProducts() {
  try {
    // Calculate the date 90 days from now
    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);

    // Query products that will expire within 90 days
    const { data: expiringProducts, error } = await supabase
      .from("products")
      .select("*, suppliers(email, phone_number, name)")
      .lt("expiry_date", ninetyDaysFromNow.toISOString())
      .gt("expiry_date", today.toISOString())
      .order("expiry_date", { ascending: true });

    if (error) throw error;

    if (!expiringProducts || expiringProducts.length === 0) {
      return { success: true, message: "No expiring products found" };
    }

    console.log(`Found ${expiringProducts.length} products expiring soon`);

    // Process each expiring product
    const notificationResults = await Promise.all(
      expiringProducts.map(async (product) => {
        const expiryDate = new Date(product.expiry_date);
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Create an alert record in the database
        await createAlertInDatabase(product, daysUntilExpiry);

        // Define notification messages
        const subject = `Product Expiring Soon: ${product.name}`;
        const emailBody = `
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
        `;
        const smsMessage = `ALERT: ${product.name} (SKU: ${product.sku}) will expire in ${daysUntilExpiry} days. Current qty: ${product.quantity} ${product.unit}. Location: ${product.location}`;

        // Get supplier information if available
        let emailResult = { success: false, error: "No recipient email found" };
        let smsResult = { success: false, error: "No recipient phone found" };

        // Send notifications to the supplier if available
        if (product.manufacturer && product.suppliers) {
          const supplier = product.suppliers;
          
          if (supplier.email) {
            emailResult = await sendEmailNotification(
              supplier.email,
              subject,
              emailBody
            );
          }
          
          if (supplier.phone_number) {
            smsResult = await sendSmsNotification(
              supplier.phone_number,
              smsMessage
            );
          }
        }

        return {
          product: product.name,
          daysUntilExpiry,
          emailSent: emailResult.success,
          smsSent: smsResult.success,
        };
      })
    );

    return {
      success: true,
      message: `Processed ${expiringProducts.length} expiring products`,
      results: notificationResults,
    };
  } catch (error) {
    console.error("Error checking expiring products:", error);
    return { success: false, error: String(error) };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // For security, only allow POST requests to trigger the check
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Run the check for expiring products
    const result = await checkExpiringProducts();
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
