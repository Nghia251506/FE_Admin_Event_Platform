import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './SidebarTenant';
import Header from './HeaderTenant';
import { ToastContainer } from 'react-toastify';
import {FCMInitializer} from './common/FCMInitializer';
import ModalFCMGlobal from './fcm/ModalFCMGlobal'
import ToastFCMContainer from './fcm/ModalFCMGlobal';

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
          <FCMInitializer /> 
          
          {/* Modal nổ ra ở tầng cao nhất của App */}
          <ToastFCMContainer />
          
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored" // Dùng theme colored cho nó rực rỡ đúng chất lễ hội
          />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
