
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const dummyData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

const Analytics = () => {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pharma-600 to-pharma-800 bg-clip-text text-transparent">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Inventory performance metrics and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-white to-pharma-50">
            <CardHeader>
              <CardTitle>Stock Levels</CardTitle>
              <CardDescription>Monthly inventory trends</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dummyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0184c7" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-pharma-50">
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Product consumption over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyData}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-white to-pharma-50">
            <CardHeader>
              <CardTitle className="text-lg">Low Stock Items</CardTitle>
              <CardDescription>Products below threshold</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pharma-600">23</div>
              <p className="text-sm text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-pharma-50">
            <CardHeader>
              <CardTitle className="text-lg">Expiring Soon</CardTitle>
              <CardDescription>Products expiring in 90 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pharma-600">15</div>
              <p className="text-sm text-muted-foreground">-2 from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-pharma-50">
            <CardHeader>
              <CardTitle className="text-lg">Total Value</CardTitle>
              <CardDescription>Current inventory value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pharma-600">$124.5k</div>
              <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
