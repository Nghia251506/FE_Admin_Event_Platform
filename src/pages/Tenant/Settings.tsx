/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import { User, Shield, Building, Bell, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ProfileSettings from '@/components/global/ProfileSettings';
import SecuritySettings from '@/components/global/SecuritySettings';
import TenantSettings from '@/components/global/TenantSetting';

const Settings: React.FC = () => {
  
  // 1. Khởi tạo state cho Tab (mặc định là profile hoặc tenant tùy ông)
  const [activeTab, setActiveTab] = useState<'tenant' | 'profile' | 'security'>('profile');

  // 2. Hàm hỗ trợ render class cho Button (cho nó đỡ rối code bên dưới)
  const getBtnClass = (tabName: string) => {
    const baseClass = "flex items-center space-x-3 p-3 rounded-lg transition duration-200 w-full ";
    return activeTab === tabName 
      ? baseClass + "bg-blue-600 text-white shadow-lg" 
      : baseClass + "text-gray-400 hover:bg-dark-700";
  };
  return (
    <div className="animate-fade-in p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Cài Đặt Hệ Thống</h1>
        <p className="text-gray-400">Quản lý cấu hình đơn vị và tài khoản của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột trái: Menu nhanh */}
        {/* SIDEBAR MENU */}
        <div className="space-y-2">
          <nav className="flex flex-col space-y-2">
            <button 
              onClick={() => setActiveTab('tenant')} 
              className={getBtnClass('tenant')}
            >
              <Building size={20} /> <span>Thông tin Đơn vị</span>
            </button>

            <button 
              onClick={() => setActiveTab('profile')} 
              className={getBtnClass('profile')}
            >
              <User size={20} /> <span>Hồ sơ cá nhân</span>
            </button>

            <button 
              onClick={() => setActiveTab('security')} 
              className={getBtnClass('security')}
            >
              <Shield size={20} /> <span>Bảo mật & Quyền</span>
            </button>
          </nav>
        </div>

        {/* CHI TIẾT NỘI DUNG (Tiêm Component vào đây) */}
        <div className="md:col-span-2 card bg-dark-800 p-6 border border-dark-700 rounded-xl min-h-[450px]">
          {activeTab === 'tenant' && <TenantSettings />}
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>

        {/* Cột phải: Nội dung chi tiết */}
        
      </div>
    </div>
  );
};

export default Settings;

