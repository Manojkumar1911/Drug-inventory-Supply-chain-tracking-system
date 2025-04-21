
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Enhanced dummy data for analytics
const monthlyStockData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 650 },
];

const usageTrendData = [
  { name: 'Jan', value: 240 },
  { name: 'Feb', value: 310 },
  { name: 'Mar', value: 280 },
  { name: 'Apr', value: 420 },
  { name: 'May', value: 380 },
  { name: 'Jun', value: 450 },
];

const categoryDistributionData = [
  { name: 'Antibiotics', value: 458 },
  { name: 'Cardiovascular', value: 623 },
  { name: 'Diabetes', value: 317 },
  { name: 'Pain Relief', value: 542 },
  { name: 'Respiratory', value: 284 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pharma-600 to-pharma-800 bg-clip-text text-transparent">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Inventory performance metrics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-pharma-50 dark:from-background dark:to-background/80">
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Items</CardTitle>
            <CardDescription>Products below threshold</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pharma-600">32</div>
            <p className="text-sm text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-pharma-50 dark:from-background dark:to-background/80">
          <CardHeader>
            <CardTitle className="text-lg">Expiring Soon</CardTitle>
            <CardDescription>Products expiring in 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pharma-600">156</div>
            <p className="text-sm text-muted-foreground">+18 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-pharma-50 dark:from-background dark:to-background/80">
          <CardHeader>
            <CardTitle className="text-lg">Total Value</CardTitle>
            <CardDescription>Current inventory value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pharma-600">$142.8k</div>
            <p className="text-sm text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white to-pharma-50 dark:from-background dark:to-background/80">
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>Monthly inventory trends</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0184c7" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-pharma-50 dark:from-background dark:to-background/80">
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
            <CardDescription>Product consumption over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0184c7" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-white to-pharma-50 dark:from-background dark:to-background/80">
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Inventory by product category</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
