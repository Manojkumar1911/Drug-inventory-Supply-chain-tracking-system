
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock } from "lucide-react";

export type AlertPriority = "low" | "medium" | "high" | "critical";

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  priority: AlertPriority;
  location: string;
  createdAt: string;
}

interface AlertCardProps {
  alert: AlertItem;
  className?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, className }) => {
  const getPriorityColor = (priority: AlertPriority) => {
    switch (priority) {
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-900";
      case "critical":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getPriorityBadge = (priority: AlertPriority) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300";
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300";
      case "high":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-300";
      case "critical":
        return "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <Card
      className={cn(
        "border-l-4 transition-all hover:shadow-md",
        getPriorityColor(alert.priority),
        className
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <AlertCircle size={16} className="mr-2" />
            {alert.title}
          </CardTitle>
          <Badge variant="secondary" className={getPriorityBadge(alert.priority)}>
            {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">{alert.description}</p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{alert.location}</span>
          <div className="flex items-center text-muted-foreground">
            <Clock size={12} className="mr-1" />
            {alert.createdAt}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
