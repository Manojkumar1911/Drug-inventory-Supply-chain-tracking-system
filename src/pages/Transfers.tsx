import React from 'react';
import TransferRecommendations from '@/components/transfers/TransferRecommendations';

const Transfers: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Transfers</h1>
        <p className="text-muted-foreground">
          Manage inventory transfers between locations
        </p>
      </div>
      
      {/* Add transfer recommendations component */}
      <TransferRecommendations />
      
      {/* You can add more components here for displaying and managing transfers */}
    </div>
  );
};

export default Transfers;
