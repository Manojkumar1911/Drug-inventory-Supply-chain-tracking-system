
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GoogleMapDisplayProps {
  address: string;
  height?: string | number;
}

const GoogleMapDisplay: React.FC<GoogleMapDisplayProps> = ({ address, height = 300 }) => {
  const [mapUrl, setMapUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!address) {
      setError('Address is required');
      setIsLoading(false);
      return;
    }
    
    try {
      // Encode the address for the URL (improved encoding)
      const encodedAddress = encodeURIComponent(address);
      
      // Create a Google Maps embed URL (using free tier - no API key needed for basic embed)
      // Note: The API key used here is a placeholder and is not associated with billing
      const url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`;
      setMapUrl(url);
      setIsLoading(false);
    } catch (err) {
      console.error("Error creating map URL:", err);
      setError('Failed to load map');
      setIsLoading(false);
    }
  }, [address]);
  
  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/30">
        <div 
          className="flex items-center justify-center"
          style={{ height }}
        >
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/30">
        <div 
          className="flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center">
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">Please provide a valid address</p>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/30 border border-slate-200 dark:border-slate-800">
      <iframe
        title="Google Map"
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapUrl}
        className="rounded-lg"
      ></iframe>
    </Card>
  );
};

export default GoogleMapDisplay;
