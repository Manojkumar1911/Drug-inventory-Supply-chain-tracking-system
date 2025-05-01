
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout: React.FC = () => {
  // Removed the state for sidebar toggle since we're making it static
  // The state is still managed in the MobileSidebar component
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Static sidebar for desktop */}
      <div className="fixed hidden md:block w-64 h-full z-30">
        <Sidebar />
      </div>
      
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Fixed header */}
        <div className="fixed top-0 right-0 left-0 z-30 md:left-64 bg-background">
          <Header />
        </div>
        
        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
