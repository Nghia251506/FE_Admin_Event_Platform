import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SidebarTenant';
import Header from './HeaderTenant';

const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-dark-950 bg-pattern-team">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <Header isCollapsed={isCollapsed} />
      
      <main
        className={`transition-all duration-300 pt-16 min-h-screen ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
