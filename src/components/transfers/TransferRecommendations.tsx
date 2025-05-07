
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeftRight, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TransferRecommendation {
  id?: string;
  product_id: number;
  product_name: string;
  quantity: number;
  from_location: string;
  to_location: string;
  status: string;
  priority: string;
}

const TransferRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<TransferRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data: alertsData, error: alertsError } = await supabase
        .from("alerts")
        .select("*")
        .eq("category", "Transfer")
        .eq("status", "New")
        .order("created_at", { ascending: false });

      if (alertsError) throw alertsError;

      // Get transfer recommendations from alerts
      const recommendationsFromAlerts: TransferRecommendation[] = [];
      
      if (alertsData) {
        for (const alert of alertsData) {
          try {
            // Parse the description to extract transfer details
            const descriptionParts = alert.description.split(" should be transferred from ");
            if (descriptionParts.length === 2) {
              const quantityAndProduct = descriptionParts[0].split(" of ");
              const locations = descriptionParts[1].split(" to ");
              
              if (quantityAndProduct.length === 2 && locations.length === 2) {
                const quantity = parseInt(quantityAndProduct[0]);
                const product_name = quantityAndProduct[1];
                const from_location = locations[0];
                const to_location = locations[1];
                
                // Get product ID
                const { data: productData } = await supabase
                  .from("products")
                  .select("id")
                  .eq("name", product_name)
                  .eq("location", to_location)
                  .single();
                
                recommendationsFromAlerts.push({
                  id: alert.id.toString(),
                  product_id: productData?.id || 0,
                  product_name,
                  quantity,
                  from_location,
                  to_location,
                  status: "Recommended",
                  priority: alert.severity === "high" ? "Urgent" : "Normal"
                });
              }
            }
          } catch (err) {
            console.error("Error parsing alert:", err);
          }
        }
      }

      setRecommendations(recommendationsFromAlerts);
    } catch (error) {
      console.error("Error fetching transfer recommendations:", error);
      toast.error("Failed to load transfer recommendations");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTransfer = async (recommendation: TransferRecommendation) => {
    if (!recommendation.id) return;
    
    setProcessingIds(prev => [...prev, recommendation.id!]);
    
    try {
      // 1. Create a new transfer record
      const { data: transferData, error: transferError } = await supabase
        .from("transfers")
        .insert([
          {
            product_id: recommendation.product_id,
            product_name: recommendation.product_name,
            quantity: recommendation.quantity,
            from_location: recommendation.from_location,
            to_location: recommendation.to_location,
            requested_by: "System",
            status: "Approved", // Auto-approve system recommendations
            priority: recommendation.priority
          }
        ])
        .select()
        .single();
        
      if (transferError) throw transferError;
      
      // 2. Update the alert status
      const { error: alertError } = await supabase
        .from("alerts")
        .update({ status: "Processed" })
        .eq("id", recommendation.id);
        
      if (alertError) throw alertError;
      
      toast.success(`Transfer for ${recommendation.product_name} created successfully`);
      
      // 3. Remove from the recommendations list
      setRecommendations(prev => prev.filter(r => r.id !== recommendation.id));
    } catch (error) {
      console.error("Error approving transfer:", error);
      toast.error("Failed to approve transfer");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== recommendation.id));
    }
  };
  
  const handleDeclineTransfer = async (recommendation: TransferRecommendation) => {
    if (!recommendation.id) return;
    
    setProcessingIds(prev => [...prev, recommendation.id!]);
    
    try {
      // Update the alert status to "Declined"
      const { error } = await supabase
        .from("alerts")
        .update({ status: "Declined" })
        .eq("id", recommendation.id);
        
      if (error) throw error;
      
      toast.info(`Transfer recommendation declined`);
      
      // Remove from the recommendations list
      setRecommendations(prev => prev.filter(r => r.id !== recommendation.id));
    } catch (error) {
      console.error("Error declining transfer:", error);
      toast.error("Failed to decline transfer recommendation");
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== recommendation.id));
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-blue-600" />
              <span>Transfer Recommendations</span>
            </div>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchRecommendations}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No transfer recommendations available.</p>
            <p className="text-sm text-muted-foreground mt-1">
              System will recommend transfers when one location has excess stock and another is running low.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((recommendation) => (
                  <TableRow key={recommendation.id}>
                    <TableCell className="font-medium">{recommendation.product_name}</TableCell>
                    <TableCell>{recommendation.quantity}</TableCell>
                    <TableCell>{recommendation.from_location}</TableCell>
                    <TableCell>{recommendation.to_location}</TableCell>
                    <TableCell>
                      <Badge className={recommendation.priority === "Urgent" 
                        ? "bg-red-100 text-red-800 hover:bg-red-100/80" 
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100/80"}>
                        {recommendation.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                          onClick={() => handleApproveTransfer(recommendation)}
                          disabled={processingIds.includes(recommendation.id!)}
                        >
                          {processingIds.includes(recommendation.id!) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                          onClick={() => handleDeclineTransfer(recommendation)}
                          disabled={processingIds.includes(recommendation.id!)}
                        >
                          {processingIds.includes(recommendation.id!) ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          <span className="sr-only">Decline</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransferRecommendations;
