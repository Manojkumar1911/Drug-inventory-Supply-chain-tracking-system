
import React, { useState } from 'react';
import TransferRecommendations from '@/components/transfers/TransferRecommendations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, CircleX, Clock, Filter, PlusCircle, RefreshCw, Search, SlidersHorizontal, Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Transfers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for demonstration
  const pendingTransfers = [
    { id: 1, product: 'Acetaminophen 500mg', quantity: 120, from: 'Main Warehouse', to: 'Retail Store', status: 'Pending', date: '2025-05-01' },
    { id: 2, product: 'Amoxicillin 250mg', quantity: 75, from: 'Central Distribution', to: 'Clinic', status: 'Pending', date: '2025-05-02' },
    { id: 3, product: 'Lisinopril 10mg', quantity: 200, from: 'Main Warehouse', to: 'Hospital', status: 'Pending', date: '2025-05-03' }
  ];
  
  const completedTransfers = [
    { id: 4, product: 'Metformin 500mg', quantity: 150, from: 'Central Distribution', to: 'Retail Store', status: 'Completed', date: '2025-04-28' },
    { id: 5, product: 'Atorvastatin 20mg', quantity: 100, from: 'Main Warehouse', to: 'Hospital', status: 'Completed', date: '2025-04-25' }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100/80"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100/80"><CircleX className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filterTransfers = (transfers: any[]) => {
    if (!searchQuery) return transfers;
    return transfers.filter(t => 
      t.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.to.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Transfers</h1>
          <p className="text-muted-foreground">
            Manage inventory transfers between locations
          </p>
        </div>
        <Button 
          className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 hover:shadow-md transition-all duration-300"
        >
          <PlusCircle className="h-4 w-4" />
          New Transfer
        </Button>
      </div>
      
      {/* Add transfer recommendations component */}
      <TransferRecommendations />
      
      {/* Transfers management section */}
      <Card className="bg-gradient-to-br from-card to-muted/50 shadow-sm hover:shadow-md transition-all duration-300 border-gray-200/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Transfer Management</span>
          </CardTitle>
          <CardDescription>
            View and manage all inventory transfers
          </CardDescription>
          
          <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transfers..."
                className="pl-8 border-gray-300 focus:border-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-1 border-gray-300 hover:bg-gray-100/50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-1 border-gray-300 hover:bg-gray-100/50"
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-1 border-gray-300 hover:bg-gray-100/50"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Columns</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger 
                value="pending"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium"
              >
                All
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
              <div className="rounded-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">From</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">To</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterTransfers(pendingTransfers).map(transfer => (
                        <tr key={transfer.id} className="border-t border-gray-200 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono">{transfer.id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{transfer.product}</td>
                          <td className="px-4 py-3 text-sm">{transfer.quantity}</td>
                          <td className="px-4 py-3 text-sm">{transfer.from}</td>
                          <td className="px-4 py-3 text-sm">{transfer.to}</td>
                          <td className="px-4 py-3 text-sm">{getStatusBadge(transfer.status)}</td>
                          <td className="px-4 py-3 text-sm">{transfer.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8 px-2 py-1 text-xs border-green-300 hover:bg-green-50 hover:text-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 px-2 py-1 text-xs border-red-300 hover:bg-red-50 hover:text-red-600">
                                <CircleX className="h-3 w-3 mr-1" /> Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filterTransfers(pendingTransfers).length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                            <AlertCircle className="mx-auto h-8 w-8 mb-2 text-muted-foreground/60" />
                            <p className="font-medium">No pending transfers found</p>
                            <p className="text-sm mt-1">Try a different search query or check again later.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
              <div className="rounded-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">From</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">To</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterTransfers(completedTransfers).map(transfer => (
                        <tr key={transfer.id} className="border-t border-gray-200 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono">{transfer.id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{transfer.product}</td>
                          <td className="px-4 py-3 text-sm">{transfer.quantity}</td>
                          <td className="px-4 py-3 text-sm">{transfer.from}</td>
                          <td className="px-4 py-3 text-sm">{transfer.to}</td>
                          <td className="px-4 py-3 text-sm">{getStatusBadge(transfer.status)}</td>
                          <td className="px-4 py-3 text-sm">{transfer.date}</td>
                        </tr>
                      ))}
                      {filterTransfers(completedTransfers).length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                            <AlertCircle className="mx-auto h-8 w-8 mb-2 text-muted-foreground/60" />
                            <p className="font-medium">No completed transfers found</p>
                            <p className="text-sm mt-1">Try a different search query or check again later.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
              <div className="rounded-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">From</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">To</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterTransfers([...pendingTransfers, ...completedTransfers]).map(transfer => (
                        <tr key={transfer.id} className="border-t border-gray-200 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono">{transfer.id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{transfer.product}</td>
                          <td className="px-4 py-3 text-sm">{transfer.quantity}</td>
                          <td className="px-4 py-3 text-sm">{transfer.from}</td>
                          <td className="px-4 py-3 text-sm">{transfer.to}</td>
                          <td className="px-4 py-3 text-sm">{getStatusBadge(transfer.status)}</td>
                          <td className="px-4 py-3 text-sm">{transfer.date}</td>
                          <td className="px-4 py-3 text-sm">
                            {transfer.status === 'Pending' && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-8 px-2 py-1 text-xs border-green-300 hover:bg-green-50 hover:text-green-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 px-2 py-1 text-xs border-red-300 hover:bg-red-50 hover:text-red-600">
                                  <CircleX className="h-3 w-3 mr-1" /> Cancel
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filterTransfers([...pendingTransfers, ...completedTransfers]).length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                            <AlertCircle className="mx-auto h-8 w-8 mb-2 text-muted-foreground/60" />
                            <p className="font-medium">No transfers found</p>
                            <p className="text-sm mt-1">Try a different search query or check again later.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transfers;
