import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Palmtree,
  DollarSign,
  Trophy,
  MessageSquare,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

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
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/tenant' },
    { icon: <Calendar size={20} />, label: 'Lịch Diễn', path: '/tenant/schedule' },
    { icon: <Users size={20} />, label: 'Thành Viên', path: '/tenant/members' },
    { icon: <Briefcase size={20} />, label: 'Khách Hàng', path: '/tenant/clients' },
    { icon: <DollarSign size={20} />, label: 'Thu Nhập', path: '/tenant/earnings' },
    { icon: <Trophy size={20} />, label: 'Thành Tích', path: '/tenant/achievements' },
    { icon: <MessageSquare size={20} />, label: 'Tin Nhắn', path: '/tenant/messages' },
    { icon: <Settings size={20} />, label: 'Cài Đặt', path: '/tenant/settings' },
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
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Palmtree size={18} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-sm bg-gradient-to-r text-primary-500 ">
                {currentUser?.tenantName || 'Đội Lân Của Bạn'}
              </span>
              <p className="text-[10px] text-dark-500">Team Portal</p>
            </div>
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
                ? 'bg-gradient-to-r from-primary-600/20 to-accent-600/10 text-primary-400 border border-primary-600/30'
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

      {/* Team Status */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-800">
          <div className="bg-gradient-to-br from-primary-600/10 to-accent-600/10 border border-primary-600/20 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-dark-400">Trạng thái</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></span>
                <span className="text-xs text-green-400 font-medium">Hoạt động</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-dark-500">Đánh giá</span>
              <span className="text-sm font-bold text-primary-400">4.9 ⭐</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
