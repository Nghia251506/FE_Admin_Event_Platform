import React from 'react';
import { User, Mail, Phone, Briefcase, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const ProfileSettings: React.FC = () => {
    const {currentUser} = useSelector((state: RootState) => state.auth);
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4 border-b border-dark-700 pb-4">
        <User className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-white">Hồ sơ cá nhân</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <User size={14} /> Họ và tên
          </label>
          <input 
            type="text" 
            className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            defaultValue={currentUser?.fullName || ''}
            placeholder="Nhập họ và tên của bạn..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Mail size={14} /> Email
          </label>
          <input 
            type="email" 
            className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-gray-500 cursor-not-allowed"
            defaultValue={currentUser?.email || ''}
            disabled 
          />
          <span className="text-[10px] text-gray-500">* Liên hệ quản trị viên sàn để đổi email</span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Phone size={14} /> Số điện thoại
          </label>
          <input 
            type="text" 
            className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-white outline-none"
            defaultValue={currentUser?.phone || ''}
            placeholder="Nhập số điện thoại của bạn..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Briefcase size={14} /> Thâm niên (năm)
          </label>
          <input 
            type="number" 
            className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-white outline-none"
            defaultValue={currentUser?.seniority || 0}
            disabled
          />
          <span className="text-[10px] text-gray-500">* Liên hệ quản trị viên đội để tính toán lại thâm niên</span>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition duration-200">
          <Save size={18} />
          <span>Cập nhật hồ sơ</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;