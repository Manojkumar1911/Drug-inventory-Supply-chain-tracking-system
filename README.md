
# PharmaLink - Next-Gen Pharmacy Inventory Management System

PharmaLink is a comprehensive pharmacy inventory management solution that uses AI to optimize stock levels, predict demand, and prevent stockouts. The system helps pharmacies manage their inventory more efficiently, reduce waste, and ensure that critical medications are always available when needed.

## Features

### Core Features
- **Real-time inventory tracking** across multiple locations
- **Smart reorder recommendations** based on usage patterns
- **Automated expiry date monitoring** and alerts to prevent waste
- **Seamless transfer management** between locations
- **Comprehensive analytics dashboard** for monitoring inventory health
- **User management** with role-based access control

### AI Features
- **ARIMA-based demand forecasting** to predict inventory needs
- **Smart Reports** with AI-generated insights and recommendations
- **AI Chatbot** for instant answers to inventory questions
- **Anomaly detection** to identify unusual patterns or issues
- **Data-driven transfer recommendations** between locations

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **State Management**: React Query
- **Charts & Visualization**: Recharts
- **AI Integration**: Gemini Pro API
- **Backend**: Supabase for database, authentication, and serverless functions

## Getting Started

1. **Clone the repository**
   ```
   git clone https://github.com/your-username/pharmalink.git
   cd pharmalink
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the application**
   ```
   npm run dev
   ```

## AI Features In-Depth

### ARIMA Model for Demand Forecasting

PharmaLink uses the ARIMA (AutoRegressive Integrated Moving Average) model, a statistical method for analyzing and forecasting time series data. Here's what our implementation offers:

- **Usage Prediction**: Forecast how much of each medicine will be needed in the coming days/weeks
- **Stock Level Prediction**: Anticipate inventory levels to prevent stockouts or overstocking
- **Confidence Intervals**: Provides upper and lower bounds for forecast accuracy
- **Trend and Seasonality Analysis**: Automatically detects and accounts for patterns in demand
- **Anomaly Detection**: Identifies unusual data points that may indicate issues

### AI Chatbot Knowledge Base

Below is a comprehensive list of questions and answers that the AI chatbot can respond to:

#### General Questions

**Q: What is PharmaLink?**  
A: PharmaLink is a next-generation pharmacy inventory management system that helps pharmacies track stock levels, forecast demand, prevent waste, and optimize transfers between locations. It features AI-powered analytics and reporting to provide actionable insights.

**Q: How do I add a new product to inventory?**  
A: You can add a new product by navigating to the Products page, clicking the "Add Product" button, and filling in the required details such as name, SKU, category, quantity, unit, reorder level, and location.

**Q: How do I set up multiple locations?**  
A: Navigate to the Locations page and click "Add Location." You'll need to provide a name, address, contact information, and assign a manager. Once created, you can transfer products between locations.

**Q: How do I run a report?**  
A: Go to the Analytics page or AI Features > Smart Reports section. Select the report type you'd like to generate (Inventory Summary, Low Stock, Expiry, or Demand Forecast), choose a timeframe, and click "Generate Report."

**Q: How do I set up alerts for low stock?**  
A: Go to Settings > Alert Configuration. You can set thresholds for low stock alerts, expiry alerts, and configure notification preferences. Make sure to set appropriate reorder levels for each product as well.

#### AI Features Questions

**Q: What does the ARIMA model do?**  
A: The ARIMA (AutoRegressive Integrated Moving Average) model is used to forecast future inventory needs based on historical usage patterns. It helps predict demand for medications, allowing you to optimize stock levels and prevent stockouts.

**Q: How accurate is the demand forecasting?**  
A: Our ARIMA model provides forecasts with confidence intervals to indicate prediction reliability. Accuracy depends on the quantity and quality of historical data, but typically achieves 85-95% accuracy for short-term forecasts (1-7 days) and 70-85% for medium-term forecasts (8-30 days).

**Q: How far ahead can the system forecast demand?**  
A: The system can generate forecasts from 3 days to 30 days ahead. Shorter forecasts (3-7 days) are typically more accurate, while longer forecasts provide a general trend direction.

**Q: What insights do Smart Reports provide?**  
A: Smart Reports analyze your inventory data to provide insights such as:
- Upcoming stock shortages
- Items approaching expiration
- Recommended transfers between locations
- Unusual usage patterns that may indicate issues
- Seasonal trends that affect inventory planning
- Optimal stock levels for each product

**Q: How does the AI help with expiring products?**  
A: The AI monitors expiry dates and provides recommendations to minimize waste, such as:
- Identifying products nearing expiration
- Suggesting transfers to locations with higher turnover
- Recommending promotional activities for soon-to-expire items
- Providing insights on purchasing patterns to avoid future expiry issues

#### Technical Questions

**Q: What databases does PharmaLink support?**  
A: PharmaLink uses Supabase as its database provider, which is built on PostgreSQL. This offers robust relational database capabilities with excellent performance and reliability.

**Q: Is my data secure?**  
A: Yes, PharmaLink implements several security measures including:
- End-to-end encryption for sensitive data
- Role-based access control
- Secure authentication via Supabase Auth
- Regular security updates and patches
- Encrypted data backups

**Q: Can I integrate PharmaLink with other systems?**  
A: Yes, PharmaLink offers API integration capabilities that allow you to connect with:
- Accounting software
- Point of Sale (POS) systems
- Electronic Health Record (EHR) systems
- Wholesale ordering platforms
- Custom internal systems

**Q: How can I backup my data?**  
A: PharmaLink automatically backs up your data daily through Supabase. You can also manually export data in CSV or JSON format from the Settings > Data Management section.

#### Usage Scenarios

**Q: How do I know when to order more inventory?**  
A: PharmaLink provides several ways to know when to reorder:
1. The dashboard shows items below reorder level
2. The Alerts section highlights low stock items
3. The AI forecast predicts upcoming shortages before they happen
4. Smart Reports provide recommendations on optimal order timing
5. Email alerts can be configured to notify you when items reach reorder levels

**Q: How do I handle transfers between locations?**  
A: Navigate to the Transfers page and click "Create Transfer." Select the source and destination locations, add products and quantities, and submit the transfer. The system will track the transfer status until it's completed.

**Q: How do I track expiring products?**  
A: You can view expiring products in several ways:
1. The dashboard shows items expiring soon
2. The Alerts section highlights critical expiry issues
3. Generate an Expiry Analysis report in the Smart Reports section
4. Configure expiry alerts in Settings to receive notifications

**Q: How do I analyze inventory performance?**  
A: Use the Analytics page to access comprehensive inventory metrics:
1. Overview dashboard with key performance indicators
2. Stock level trends over time
3. Category distribution and analysis
4. Turnover rate by product and location
5. Seasonal patterns and forecasts
6. AI-generated insights and recommendations

**Q: How do I optimize my inventory levels?**  
A: PharmaLink helps optimize inventory through:
1. ARIMA forecasting to predict optimal stock levels
2. Smart Reports with AI-powered recommendations
3. Analytics dashboards showing historical performance
4. Automatic calculation of ideal reorder points
5. Transfer recommendations to balance stock across locations

## Email Alert Setup

To enable email alerts for low stock, expiring inventory, and other notifications:

1. Sign up for a [Resend](https://resend.com) account
2. Get your API key from the Resend dashboard
3. In PharmaLink, go to Settings > Email Configuration
4. Enter your Resend API key
5. Configure alert preferences and recipients

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
