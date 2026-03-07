import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';

interface HeaderProps {
  isCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ isCollapsed }) => {
  const dispatch = useDispatch<AppDispatch>();
    const handleLogout = () => {
      dispatch(logoutUser());
    };
    const { currentUser } = useSelector((state: RootState) => state.auth);
  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-dark-900/95 backdrop-blur-sm border-b border-dark-800 z-40 transition-all duration-300 ${
        isCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện, khách hàng, đội lân..."
              className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-dark-800 rounded-lg transition-colors">
            <Bell size={20} className="text-dark-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-dark-800">
            <div className="text-right">
              <p className="text-sm font-medium text-dark-200">{currentUser?.fullName || 'Admin User'}</p>
              <p className="text-xs text-dark-500">{currentUser?.roleName || 'Quản trị viên'}</p>
            </div>
            <div className="relative group">
              <button className="w-10 h-10 bg-gradient-to-br from-primary-600 to-gold-600 rounded-lg flex items-center justify-center hover:shadow-lg transition-all">
                <User size={20} className="text-white" />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full w-48 pt-2 bg-dark-800 border border-dark-700 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                <div className="p-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-dark-300 hover:bg-dark-700 rounded-lg transition-colors">
                    <User size={16} />
                    <span>Tài khoản</span>
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary-400 hover:bg-dark-700 rounded-lg transition-colors">
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
