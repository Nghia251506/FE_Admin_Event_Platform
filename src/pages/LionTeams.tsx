import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Users, Star, Award, Loader2, Phone, Mail } from 'lucide-react';
import { fetchTenants } from '@/store/slices/tenantSlice';
import { RootState, AppDispatch } from '@/store/store';

const LionTeams: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 1. Lấy dữ liệu từ tenantSlice
  const { tenants, loading, error } = useSelector((state: RootState) => state.tenants);

  // 2. Gọi API lấy danh sách đội ngay khi vào trang
  useEffect(() => {
    dispatch(fetchTenants());
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary-500" size={48} />
        <p className="text-dark-400">Đang tải danh sách các đội lân...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="card border-red-500/50 text-center py-10">
        <p className="text-red-400">Lỗi: {error}</p>
        <button 
          onClick={() => dispatch(fetchTenants())}
          className="btn-primary mt-4 py-2 px-4"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Quản Lý Đội Lân
          </h1>
          <p className="text-dark-400">Quản lý đối tác và các đoàn nghệ thuật trên hệ thống</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Thêm Đội Mới</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tenants.length > 0 ? (
          tenants.map((team) => (
            <div
              key={team.id}
              className="card hover:border-primary-600/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Team Avatar - Dùng ảnh logo nếu có, không thì dùng Icon mặc định */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold">{team.name.charAt(0)}</span>
                  )}
                </div>

                {/* Team Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                      {team.name}
                    </h3>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        team.active 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {team.active ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-2 text-xs text-dark-400">
                      <Phone size={12} className="text-primary-500" />
                      <span>{team.phone || 'Chưa cập nhật SĐT'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-dark-400">
                      <Mail size={12} className="text-accent-500" />
                      <span className="truncate max-w-[200px]">{team.email}</span>
                    </div>
                  </div>

                  {/* Stats - Giả định các trường này có trong TenantResponse, nếu không hãy map theo đúng DB của ông */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-1 text-dark-500 mb-1">
                        <Users size={14} />
                        <span className="text-[10px] uppercase">Thành viên</span>
                      </div>
                      <p className="text-lg font-bold text-white">{team.memberCount || 0}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-dark-500 mb-1">
                        <Star size={14} />
                        <span className="text-[10px] uppercase">Rating</span>
                      </div>
                      <p className="text-lg font-bold text-yellow-500">
                        {team.rating || '5.0'}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-dark-500 mb-1">
                        <Award size={14} />
                        <span className="text-[10px] uppercase">Job xong</span>
                      </div>
                      <p className="text-lg font-bold text-primary-500">
                        {team.completedEvents || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-dark-800 flex gap-2">
                <button className="flex-1 btn-secondary text-sm py-2">
                  Xem Chi Tiết
                </button>
                <button className="flex-1 btn-primary text-sm py-2">
                   Quản Lý Role
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center card border-dashed border-dark-700">
             <p className="text-dark-400">Hiện tại chưa có đối tác đội lân nào tham gia hệ thống.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LionTeams;