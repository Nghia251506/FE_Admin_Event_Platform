import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DashboardTenant from "@/pages/Tenant/DashboardTenant"
// import Events from './pages/Events';
import LionTeams from './pages/LionTeams';
import Customers from './pages/Customers';
import Services from './pages/Services';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Contracts from './pages/Contracts';
import Settings from './pages/Settings';
import SettingTenant from './pages/Tenant/Settings';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/Login';
import Schedule from './pages/Tenant/Schedule';
import Members from './pages/Tenant/Members';
import Clients from './pages/Tenant/Clients';
import Earnings from './pages/Tenant/Earnings';
import Achievements from './pages/Tenant/Achievements';
import Messages from './pages/Tenant/Messages';
import LayoutTenant from './components/LayoutTenant';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['SUPER_ADMIN']}><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          {/* <Route path="events" element={<Events />} /> */}
          <Route path="lion-teams" element={<LionTeams />} />
          <Route path="customers" element={<Customers />} />
          <Route path="services" element={<Services />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/tenant" element={<PrivateRoute allowedRoles={['ADMIN','TN_MEMBER']}><LayoutTenant /></PrivateRoute>}>
          <Route index element={<DashboardTenant />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="members" element={<Members />} />
          <Route path="clients" element={<Clients />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<SettingTenant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
