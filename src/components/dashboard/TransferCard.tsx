
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export type TransferStatus = 
  | "pending" 
  | "approved" 
  | "in-transit" 
  | "completed" 
  | "cancelled";

export interface Transfer {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  sourceLocation: string;
  destinationLocation: string;
  status: TransferStatus;
  requestDate: string;
  estimatedDelivery?: string;
}

interface TransferCardProps {
  transfer: Transfer;
  className?: string;
}

const TransferCard: React.FC<TransferCardProps> = ({ transfer, className }) => {
  const getStatusColor = (status: TransferStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300";
      case "approved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300";
      case "in-transit":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80 dark:bg-purple-900/30 dark:text-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "";
    }
  };

  const formatStatus = (status: TransferStatus) => {
    return status
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <PackageOpen size={16} className="mr-2" />
            Transfer #{transfer.id}
          </CardTitle>
          <Badge className={getStatusColor(transfer.status)}>
            {formatStatus(transfer.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-sm">{transfer.productName}</p>
        <p className="text-sm text-muted-foreground">
          {transfer.quantity} {transfer.unit}
        </p>
        
        <div className="mt-3 flex items-center text-sm">
          <span className="flex-1 truncate">{transfer.sourceLocation}</span>
          <ArrowRight size={16} className="mx-2 flex-shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-right">{transfer.destinationLocation}</span>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center text-muted-foreground">
            <Clock size={12} className="mr-1" />
            Requested: {transfer.requestDate}
          </div>
          {transfer.estimatedDelivery && (
            <div className="text-muted-foreground">
              ETA: {transfer.estimatedDelivery}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransferCard;
