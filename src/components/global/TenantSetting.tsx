import React from 'react';
import { Building, Globe, Save, Info } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


const TenantSettings: React.FC = () => {
    const {currentUser} = useSelector((state: RootState) => state.auth);
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header của Section */}
      <div className="flex items-center space-x-2 mb-6 border-b border-dark-700 pb-4">
        <Building className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-white">Cấu hình Đội (Tenant)</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Tên đơn vị */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            Tên đơn vị
          </label>
          <input 
            type="text" 
            className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            defaultValue={currentUser?.tenantName || ''}
            placeholder="Nhập tên đơn vị của bạn..."
          />
        </div>

        {/* Mã đơn vị - Thường là Slug không cho sửa */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            Mã đơn vị (Slug)
          </label>
          <div className="relative">
            <input 
              type="text" 
              className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-gray-500 cursor-not-allowed italic"
              defaultValue={currentUser?.tenantName ? `tenant-id-${currentUser.tenantId}` : 'Chưa có mã'}
              disabled 
            />
            <div className="absolute inset-y-0 right-3 flex items-center text-gray-600">
              <Info size={16} title="Mã đơn vị cố định để định danh hệ thống" />
            </div>
          </div>
          <p className="text-[11px] text-gray-500">Mã này dùng để phân biệt dữ liệu của bạn với các đội khác trên sàn.</p>
        </div>

        {/* Website hoặc thông tin thêm (Ví dụ thêm để form nhìn đầy đủ hơn) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Globe size={14} /> Website / Landing Page
          </label>
          <input 
            type="text" 
            className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://your-team.com"
          />
        </div>
      </div>

      {/* Nút Save riêng cho Tenant nếu muốn, hoặc dùng nút Save tổng ở file cha */}
      <div className="flex justify-end pt-6">
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition duration-200 shadow-lg active:scale-95">
          <Save size={18} />
          <span>Lưu thông tin đội</span>
        </button>
      </div>
    </div>
  );
};

export default TenantSettings;