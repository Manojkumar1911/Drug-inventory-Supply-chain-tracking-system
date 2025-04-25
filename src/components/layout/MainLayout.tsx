
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="fixed z-40 h-full md:static">
        <Sidebar />
      </div>
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex flex-1 flex-col">
        <div className="fixed top-0 right-0 left-0 z-30 md:left-64">
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <main className="flex-1 p-4 md:p-6 md:ml-0 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
