
import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";

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
      // Encode the address for the URL
      const encodedAddress = encodeURIComponent(address);
      
      // Create a Google Maps embed URL (using free tier/no API key)
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
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
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
    <Card className="w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/30">
      <iframe
        title="Google Map"
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={mapUrl}
      ></iframe>
    </Card>
  );
};

export default GoogleMapDisplay;
