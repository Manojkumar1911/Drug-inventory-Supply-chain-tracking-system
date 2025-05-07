
# PharmInventory - Pharmaceutical Inventory Management System

## Overview

PharmInventory is a comprehensive inventory management system designed specifically for pharmaceutical companies. It provides real-time alerts, transfer tracking between locations, analytics reporting, and user management with role-based access control.

![PharmInventory Dashboard](https://via.placeholder.com/1200x600?text=PharmInventory+Dashboard)

## Key Features

### Real-time Alert System
- **Expiration Alerts**: Automatically sends email and SMS notifications for products approaching expiry dates
- **Low Stock Alerts**: Sends notifications when inventory levels fall below reorder thresholds
- **Customizable Alert Settings**: Configure alert thresholds and recipients

### Inter-Inventory Transfer System
- **Smart Transfer Recommendations**: System automatically identifies when one location has excess stock while another location is running low
- **Transfer Management**: Track transfer status from initiation to completion
- **Notifications**: Email alerts to location managers when transfers are recommended or approved

### Comprehensive Inventory Management
- **Product Tracking**: Monitor quantities, locations, expiration dates, and more
- **Batch Management**: Track inventory by batch numbers and expiration dates
- **CSV Import/Export**: Bulk upload and download inventory data
- **Supplier Management**: Keep track of suppliers with contact information

### User-Friendly Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Navigation**: Easy-to-use sidebar for quick access to features
- **Visual Dashboards**: At-a-glance view of critical inventory metrics
- **Search & Filter**: Quickly find products and transactions

## Technology Stack

### Frontend
- **React**: UI library for building component-based interfaces
- **TypeScript**: Type-safe JavaScript for robust application development
- **Tailwind CSS**: Utility-first CSS framework for custom designs
- **Shadcn UI**: High-quality UI components built on Radix UI
- **Lucide React**: Beautiful, consistent icons
- **React Router**: Declarative routing for React applications
- **Recharts**: Composable charting library for analytics
- **Sonner**: Toast notifications for user feedback

### Backend
- **Supabase**: Backend-as-a-service platform for database and authentication
- **PostgreSQL**: Relational database for data storage
- **Edge Functions**: Serverless functions for backend logic
- **Row Level Security (RLS)**: Database-level security policies

### Communication Services
- **Resend**: Email service for sending alerts and notifications
- **Twilio**: SMS service for urgent alerts

## Installation

### Prerequisites
- Node.js (v16 or later)
- npm or bun package manager
- Supabase account (free tier works fine)

### Initial Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/pharminventory.git
cd pharminventory
```

2. Install dependencies
```bash
npm install
# or
bun install
```

3. Create a `.env` file in the root directory
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-SUPABASE-URL]:5432/postgres
RESEND_API_KEY=your_resend_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

4. Start the development server
```bash
npm run dev
# or
bun run dev
```

## Database Setup

1. Log into your Supabase dashboard
2. Go to the SQL Editor
3. Copy the complete schema from `src/server/schema.sql`
4. Paste it into the SQL Editor and run the script

## Setting up Alert Notifications

The system uses Resend for email notifications and Twilio for SMS alerts:

1. **Resend Setup**:
   - Create an account at [Resend](https://resend.com)
   - Get your API key from the dashboard
   - Add it to your environment variables as `RESEND_API_KEY`

2. **Twilio Setup**:
   - Create an account at [Twilio](https://www.twilio.com)
   - Get your Account SID and Auth Token from the console dashboard
   - Purchase a phone number through Twilio
   - Add these details to your environment variables

## Usage Guide

### Managing Products
- Navigate to the Products page to add, edit, and delete products
- Use the CSV upload feature for bulk imports
- Set reorder levels to trigger low stock alerts
- Add expiration dates to enable expiry alerts

### Managing Locations
- Add different inventory locations (warehouses, retail stores, etc.)
- Assign managers and contact information for each location
- View stock levels across all locations

### Managing Transfers
- Create transfer requests between locations
- Approve or deny transfer requests
- Track transfer status
- Review automatic transfer recommendations

### Alerts and Notifications
- Use the alert action buttons to manually trigger checks
- Configure alert thresholds in settings
- Add recipients for email and SMS notifications
- View alert history in the Alerts page

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact support@pharminventory.com

---

Built with ❤️ by PharmInventory Team
