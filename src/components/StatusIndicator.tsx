
import { useApiStatus } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Database, Server, AlertCircle, Cloud } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const StatusIndicator = () => {
  const { status, loading } = useApiStatus();
  const [supabaseStatus, setSupabaseStatus] = useState({
    connected: false,
    loading: true,
    message: "Checking connection..."
  });

  // Check Supabase connection
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Use a safer method to check connection without using tables that may not exist yet
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setSupabaseStatus({
            connected: false,
            loading: false,
            message: `Supabase not connected: ${error.message}`
          });
          return;
        }
        
        setSupabaseStatus({
          connected: true,
          loading: false,
          message: "Supabase connected"
        });
      } catch (error) {
        setSupabaseStatus({
          connected: false,
          loading: false,
          message: "Supabase connection error"
        });
      }
    };
    
    checkSupabaseConnection();
  }, []);

  if (loading || supabaseStatus.loading) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="animate-pulse text-xs py-0 h-5">
          Checking connection...
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Server className={`h-3.5 w-3.5 ${status.server ? 'text-green-500' : 'text-red-500'}`} />
              <Database className={`h-3.5 w-3.5 ${status.database ? 'text-green-500' : 'text-red-500'}`} />
              <Cloud className={`h-3.5 w-3.5 ${supabaseStatus.connected ? 'text-green-500' : 'text-amber-500'}`} />
              
              {(!status.server || !status.database || !supabaseStatus.connected) && (
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-sm">
              <div className="font-medium mb-1">System Status</div>
              <div className="flex items-center gap-2">
                <Server className="h-3.5 w-3.5" />
                <span>Server: {status.server ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5" />
                <span>Database: {status.database ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-3.5 w-3.5" />
                <span>Supabase: {supabaseStatus.connected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{status.message}</div>
              {!supabaseStatus.connected && (
                <div className="text-xs text-amber-500 mt-1">{supabaseStatus.message}</div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StatusIndicator;
