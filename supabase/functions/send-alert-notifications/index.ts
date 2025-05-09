
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

// Default contact for testing
const DEFAULT_EMAIL = "manojs3274@gmail.com"; // Changed to match the validation error message
const DEFAULT_PHONE = "+919600943274"; // Adding the country code for Twilio

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// This function sends an email notification using Resend with rate limiting
async function sendEmailNotification(recipient: string, subject: string, body: string) {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    console.log(`Attempting to send email to: ${recipient}`);
    
    // Add delay to prevent rate limiting (Resend allows 2 requests per second)
    await new Promise(resolve => setTimeout(resolve, 600)); // 600ms delay
    
    // Fix: Use the correct "from" email address that matches the intended recipient's domain
    // For testing, using the verified domain/address allowed by Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PharmaLink <manojs3274@gmail.com>", // Using user's verified email address
        to: recipient || DEFAULT_EMAIL,
        subject: subject,
        html: body,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Email sending failed:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }
    
    console.log("Email response:", data);
    return { success: true, data };
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
    console.log(`Attempting to send SMS to: ${phoneNumber}`);
    
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    const formData = new URLSearchParams();
    formData.append("To", phoneNumber || DEFAULT_PHONE);
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
    console.log("SMS response:", data);
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

// This function handles notifications for low stock products
async function notifyLowStockProducts() {
  try {
    // Find products with quantity below reorder level
    // Fix: Using the correct method for comparing numeric columns
    const { data: lowStockProducts, error } = await supabase
      .from("products")
      .select("*, suppliers(email, phone_number, name)")
      .lt('quantity', supabase.rpc('get_reorder_level', { product_id: 'id' }));

    if (error) throw error;

    if (!lowStockProducts || lowStockProducts.length === 0) {
      return { success: true, message: "No low stock products found" };
    }

    console.log(`Found ${lowStockProducts.length} low stock products`);

    // Process each low stock product
    const notificationResults = await Promise.all(
      lowStockProducts.map(async (product) => {
        // Create an alert record in the database
        await supabase.from("alerts").insert([
          {
            title: `Low Stock Alert: ${product.name}`,
            description: `${product.name} (SKU: ${product.sku}) is below reorder level. Current quantity: ${product.quantity}, Reorder Level: ${product.reorder_level}`,
            severity: product.quantity === 0 ? "critical" : "high",
            category: "Stock",
            location: product.location,
            status: "New",
          },
        ]);

        // Define notification messages
        const subject = `Low Stock Alert: ${product.name}`;
        const emailBody = `
          <h2>Low Stock Alert</h2>
          <p>This is an automated notification to inform you that the following product is below reorder level:</p>
          <ul>
            <li><strong>Product Name:</strong> ${product.name}</li>
            <li><strong>SKU:</strong> ${product.sku}</li>
            <li><strong>Current Quantity:</strong> ${product.quantity} ${product.unit}</li>
            <li><strong>Reorder Level:</strong> ${product.reorder_level} ${product.unit}</li>
            <li><strong>Location:</strong> ${product.location}</li>
          </ul>
          <p>Please take appropriate action to reorder this product.</p>
        `;
        const smsMessage = `ALERT: ${product.name} (SKU: ${product.sku}) is below reorder level. Current qty: ${product.quantity} ${product.unit}. Location: ${product.location}`;

        // Send to default contact for testing
        const emailResult = await sendEmailNotification(
          DEFAULT_EMAIL,
          subject,
          emailBody
        );
          
        const smsResult = await sendSmsNotification(
          DEFAULT_PHONE,
          smsMessage
        );

        return {
          product: product.name,
          emailSent: emailResult.success,
          smsSent: smsResult.success,
        };
      })
    );

    return {
      success: true,
      message: `Processed ${lowStockProducts.length} low stock products`,
      results: notificationResults,
    };
  } catch (error) {
    console.error("Error checking low stock products:", error);
    return { success: false, error: String(error) };
  }
}

// This function handles inter-inventory transfer recommendations
async function recommendInventoryTransfers() {
  try {
    // Get all locations
    const { data: locations, error: locationError } = await supabase
      .from("locations")
      .select("name, id")
      .eq("is_active", true);
    
    if (locationError) throw locationError;
    
    if (!locations || locations.length < 2) {
      return { success: true, message: "Not enough locations for transfers" };
    }
    
    // Get all low stock products - fix the comparison method
    const { data: lowStockProducts, error: productError } = await supabase
      .from("products")
      .select("*")
      .lt('quantity', 'reorder_level');
    
    if (productError) throw productError;
    
    if (!lowStockProducts || lowStockProducts.length === 0) {
      return { success: true, message: "No low stock products for transfer" };
    }
    
    // For each low stock product, check if other locations have excess stock
    const transferRecommendations = [];
    
    for (const product of lowStockProducts) {
      // Find products with same name/SKU at other locations with excess stock
      const { data: excessProducts, error: excessError } = await supabase
        .from("products")
        .select("*")
        .eq("name", product.name)
        .neq("location", product.location)
        .gt('quantity', 'reorder_level');
      
      if (excessError) throw excessError;
      
      if (excessProducts && excessProducts.length > 0) {
        // Sort by highest excess quantity
        excessProducts.sort((a, b) => 
          (b.quantity - b.reorder_level) - (a.quantity - a.reorder_level)
        );
        
        const excessProduct = excessProducts[0];
        const recommendedTransferQty = Math.min(
          excessProduct.quantity - excessProduct.reorder_level - 5, // Leave buffer of 5
          product.reorder_level - product.quantity + 5 // Request enough to be above reorder + small buffer
        );
        
        if (recommendedTransferQty > 0) {
          // Create a transfer recommendation
          transferRecommendations.push({
            product_id: product.id,
            product_name: product.name,
            from_location: excessProduct.location,
            to_location: product.location,
            quantity: recommendedTransferQty,
            priority: product.quantity === 0 ? "Urgent" : "Normal",
            status: "Recommended"
          });
          
          // Create alert for the recommendation
          await supabase.from("alerts").insert([{
            title: `Transfer Recommendation: ${product.name}`,
            description: `${recommendedTransferQty} ${product.unit} of ${product.name} should be transferred from ${excessProduct.location} to ${product.location}`,
            severity: product.quantity === 0 ? "high" : "medium",
            category: "Transfer",
            location: product.location,
            status: "New"
          }]);
          
          // Add delays between email notifications to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Send email notification
          await sendEmailNotification(
            DEFAULT_EMAIL,
            `Inventory Transfer Request: ${product.name}`,
            `
            <h2>Inventory Transfer Request</h2>
            <p>A transfer of inventory has been recommended:</p>
            <ul>
              <li><strong>Product:</strong> ${product.name}</li>
              <li><strong>Quantity:</strong> ${recommendedTransferQty} ${product.unit}</li>
              <li><strong>From Location:</strong> ${excessProduct.location}</li>
              <li><strong>To Location:</strong> ${product.location}</li>
              <li><strong>Priority:</strong> ${product.quantity === 0 ? "Urgent" : "Normal"}</li>
            </ul>
            <p>Please coordinate this transfer with the receiving location.</p>
            `
          );
          
          // Add delay between emails
          await new Promise(resolve => setTimeout(resolve, 500));
          
          await sendEmailNotification(
            DEFAULT_EMAIL,
            `Incoming Inventory Transfer: ${product.name}`,
            `
            <h2>Incoming Inventory Transfer</h2>
            <p>A transfer of inventory to your location has been recommended:</p>
            <ul>
              <li><strong>Product:</strong> ${product.name}</li>
              <li><strong>Quantity:</strong> ${recommendedTransferQty} ${product.unit}</li>
              <li><strong>From Location:</strong> ${excessProduct.location}</li>
              <li><strong>To Location:</strong> ${product.location}</li>
              <li><strong>Priority:</strong> ${product.quantity === 0 ? "Urgent" : "Normal"}</li>
            </ul>
            <p>The sending location has been notified. Please follow up to confirm this transfer.</p>
            `
          );
        }
      }
    }
    
    return {
      success: true,
      message: "Transfer recommendations processed",
      recommendationsCount: transferRecommendations.length,
      recommendations: transferRecommendations
    };
  } catch (error) {
    console.error("Error creating inventory transfer recommendations:", error);
    return { success: false, error: String(error) };
  }
}

// This function checks for expiring products
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

    // Process each expiring product with delays
    const notificationResults = [];
    
    for (const product of expiringProducts) {
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

      // Add delays between sending emails/SMS to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Send to default contact for testing
      const emailResult = await sendEmailNotification(
        DEFAULT_EMAIL,
        subject,
        emailBody
      );
        
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const smsResult = await sendSmsNotification(
        DEFAULT_PHONE,
        smsMessage
      );

      notificationResults.push({
        product: product.name,
        daysUntilExpiry,
        emailSent: emailResult.success,
        smsSent: smsResult.success,
      });
    }

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
    // Parse request to determine which checks to run
    const requestData = await req.json().catch(() => ({}));
    const checkType = requestData.checkType || "all";
    
    let result;
    
    switch (checkType) {
      case "expiry":
        result = await checkExpiringProducts();
        break;
      case "stock":
        result = await notifyLowStockProducts();
        break;
      case "transfers":
        result = await recommendInventoryTransfers();
        break;
      case "all":
      default:
        // Run checks sequentially with delays to avoid rate limiting
        const expiryResult = await checkExpiringProducts();
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
        const stockResult = await notifyLowStockProducts();
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
        const transfersResult = await recommendInventoryTransfers();
        
        result = {
          success: expiryResult.success && stockResult.success && transfersResult.success,
          expiryChecks: expiryResult,
          stockChecks: stockResult,
          transferRecommendations: transfersResult
        };
        break;
    }
    
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
