import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Palmtree,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3,
  Package,
  CreditCard,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Calendar size={20} />, label: 'Sự Kiện', path: '/admin/events' },
    { icon: <Palmtree size={20} />, label: 'Đội Lân', path: '/admin/lion-teams' },
    { icon: <Users size={20} />, label: 'Khách Hàng', path: '/admin/customers' },
    { icon: <Package size={20} />, label: 'Dịch Vụ', path: '/admin/services' },
    { icon: <CreditCard size={20} />, label: 'Thanh Toán', path: '/admin/payments' },
    { icon: <BarChart3 size={20} />, label: 'Báo Cáo', path: '/admin/reports' },
    { icon: <FileText size={20} />, label: 'Hợp Đồng', path: '/admin/contracts' },
    { icon: <Settings size={20} />, label: 'Cài Đặt', path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`sidebar-transition fixed left-0 top-0 h-screen bg-dark-900 border-r border-dark-800 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-dark-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-gold-600 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg bg-gradient-to-r from-primary-500 to-gold-500 bg-clip-text text-transparent">
              LionDance
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-dark-800 rounded-lg transition-colors ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-dark-400" />
          ) : (
            <ChevronLeft size={20} className="text-dark-400" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-primary-600/20 to-gold-600/10 text-primary-400 border border-primary-600/30'
                : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'
            }`}
          >
            <span className={isActive(item.path) ? 'text-primary-400' : 'text-dark-400 group-hover:text-dark-200'}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="font-medium text-sm">{item.label}</span>
            )}
            {isCollapsed && (
              <div className="absolute left-20 bg-dark-800 text-dark-200 px-3 py-2 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-800">
          <div className="bg-gradient-to-br from-primary-600/10 to-gold-600/10 border border-primary-600/20 rounded-lg p-3">
            <p className="text-xs text-dark-400 mb-1">Version 1.0.0</p>
            <p className="text-xs text-dark-500">© 2024 LionDance Pro</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
