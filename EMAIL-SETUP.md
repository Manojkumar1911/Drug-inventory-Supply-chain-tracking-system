
# PharmaLink Email Notification Setup Guide

This document explains how to set up and configure email notifications in the PharmaLink system.

## Overview

PharmaLink uses the Resend email service to send notifications for important events such as:
- Low stock alerts
- Product expiry notifications
- Transfer approvals
- Purchase order status updates

## Prerequisites

To enable email sending functionality, you need:

1. A Resend account (https://resend.com)
2. A verified domain in Resend
3. An API key from Resend

## Setup Steps

### 1. Create a Resend Account

If you don't already have a Resend account:
1. Go to https://resend.com and sign up
2. Verify your email address
3. Log in to your account

### 2. Verify Your Domain

For production use, you should verify your domain:
1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Follow the instructions to add DNS records that verify your ownership of the domain
4. Wait for domain verification to complete (this may take up to 24-48 hours)

### 3. Create an API Key

To generate an API key:
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Give your API key a name (e.g., "PharmaLink Notifications")
4. Copy the API key when it's displayed (you won't be able to see it again)

### 4. Configure PharmaLink to Use Your API Key

1. Add your Resend API key to Supabase Edge Function Secrets:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API > Edge Function Secrets
   - Add a new secret with the name `RESEND_API_KEY` and paste your API key as the value
   - Save the changes

2. Configure email notification settings in PharmaLink:
   - Log in to your PharmaLink account
   - Navigate to Settings > Notifications
   - Enable the email notifications you want to receive
   - Save your settings

## Testing the Email Functionality

To test if your email setup is working correctly:

1. Go to the Products page
2. Edit a product and set its expiry date to a date in the near future (within the notification threshold)
3. Save the changes
4. Go to the Alerts page and click on "Send Test Alert" for an expiry notification
5. Check your email to see if you received the test notification

## Troubleshooting

If you're not receiving email notifications:

1. **Check your API key:** Ensure your Resend API key is correctly added to your Supabase Edge Function Secrets
2. **Verify domain status:** Make sure your domain is properly verified in Resend
3. **Check notification settings:** Ensure email notifications are enabled in Settings > Notifications
4. **Check spam folder:** Look in your email spam folder as notifications may be filtered there
5. **Check Edge Function logs:** Review the logs for the `send-email-alert` Edge Function in your Supabase dashboard

## Tips for Production Use

1. **Use a dedicated sender domain:** For the best deliverability, use a subdomain dedicated to sending emails (e.g., `notifications.yourdomain.com`)
2. **Set up email templates:** Customize your email templates in Settings > Notifications to match your brand
3. **Configure notification thresholds:** Adjust the thresholds for when notifications are sent (e.g., days before expiry) to suit your needs
4. **Test thoroughly:** Before relying on the system in production, test all notification types

For further assistance, contact support@pharmalink.app
