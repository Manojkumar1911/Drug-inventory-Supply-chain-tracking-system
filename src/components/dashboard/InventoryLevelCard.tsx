
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  isLowStock: boolean;
  expiringWithin30Days: boolean;
  unit: string;
}

interface InventoryLevelCardProps {
  item: InventoryItem;
  className?: string;
}

const InventoryLevelCard: React.FC<InventoryLevelCardProps> = ({ 
  item, 
  className 
}) => {
  const stockPercentage = Math.min(
    Math.round((item.currentStock / item.maximumStock) * 100),
    100
  );
  
  const getStockColor = () => {
    if (item.isLowStock) return "text-destructive";
    if (item.expiringWithin30Days) return "text-warning-foreground";
    return "text-success";
  };
  
  const getProgressColor = () => {
    if (stockPercentage <= 25) return "bg-destructive";
    if (stockPercentage <= 50) return "bg-warning";
    return "bg-success";
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className={cn("text-sm font-medium", getStockColor())}>
            {item.currentStock} {item.unit}
          </span>
          <span className="text-xs text-muted-foreground">
            Min: {item.minimumStock} | Max: {item.maximumStock} {item.unit}
          </span>
        </div>
        <Progress 
          value={stockPercentage} 
          className={cn("mt-2 h-2", getProgressColor())}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className={cn("font-medium", getStockColor())}>
            {stockPercentage}%
          </span>
          {item.isLowStock && (
            <span className="font-medium text-destructive">Low Stock</span>
          )}
          {item.expiringWithin30Days && !item.isLowStock && (
            <span className="font-medium text-warning-foreground">Expiring Soon</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryLevelCard;
