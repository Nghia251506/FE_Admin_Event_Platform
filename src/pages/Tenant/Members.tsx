import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Plus, Phone, Mail, Award, Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { fetchUsers } from '@/store/slices/userSlice'; // Điều chỉnh đường dẫn cho đúng nhé ông giáo
import { AppDispatch, RootState } from '@/store/store';

const Members: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // 1. Lấy dữ liệu từ Redux Store
  const { users: members, loading, totalCount } = useSelector((state: RootState) => state.users);

  // 2. Fetch data khi page thay đổi
  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage - 1 , size: pageSize }));
  }, [dispatch, currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Hàm chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Quản Lý Thành Viên
          </h1>
          <p className="text-dark-400">Danh sách và thông tin thành viên đội</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Thêm Thành Viên</span>
        </button>
      </div>

      {/* Team Overview - Giữ nguyên UI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <Users size={24} className="text-primary-500 mb-3" />
          <h3 className="text-2xl font-bold text-white mb-1">{totalCount}</h3>
          <p className="text-sm text-dark-400">Tổng thành viên</p>
        </div>
        <div className="card">
          <div className="w-6 h-6 bg-green-500 rounded-full mb-3"></div>
          <h3 className="text-2xl font-bold text-white mb-1">8</h3>
          <p className="text-sm text-dark-400">Đang hoạt động</p>
        </div>
        <div className="card">
          <Award size={24} className="text-accent-500 mb-3" />
          <h3 className="text-2xl font-bold text-white mb-1">4.8</h3>
          <p className="text-sm text-dark-400">Đánh giá trung bình</p>
        </div>
        <div className="card">
          <Calendar size={24} className="text-green-500 mb-3" />
          <h3 className="text-2xl font-bold text-white mb-1">156</h3>
          <p className="text-sm text-dark-400">Sự kiện trung bình/người</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-primary-500">
          <Loader2 className="animate-spin mb-2" size={40} />
          <p className="text-dark-400">Đang tải danh sách thành viên...</p>
        </div>
      ) : (
        <>
          {/* Members Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {members.map((member: any) => (
              <div
                key={member.id}
                className="card hover:border-primary-600/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar - Có thể dùng avatar từ API hoặc emoji mặc định */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center text-4xl relative">
                      {member.avatar || (member.gender === 'female' ? '👩' : '👨')}
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-900 ${
                          member.status === 'active'
                            ? 'bg-green-500 animate-pulse-slow'
                            : 'bg-yellow-500'
                        }`}
                      ></span>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                          {member.fullName}
                        </h3>
                        <p className="text-sm text-dark-400">{member.roleName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={14} className="text-primary-500" />
                        <span className="text-sm font-bold text-primary-400">
                          {member.rating || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-xs text-dark-500">
                        <Phone size={12} />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-dark-500">
                        <Mail size={12} />
                        <span>{member.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {(member.skills || []).map((skill: string, index: number) => (
                        <span key={index} className="badge bg-dark-800 text-dark-300">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-dark-800">
                      <div className="text-xs text-dark-500">
                        Tham gia: <span className="text-dark-400">{member.joinDate}</span>
                      </div>
                      <div className="text-xs text-dark-500">
                        Sự kiện: <span className="text-primary-400 font-semibold">{member.events}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Pagination Controls */}
          <div className="flex items-center justify-center gap-4 mt-8 pb-10">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-dark-800 text-white disabled:opacity-30 hover:bg-dark-700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    currentPage === idx + 1 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                    : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-dark-800 text-white disabled:opacity-30 hover:bg-dark-700 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}

      {/* Add Member Card - Giữ nguyên UI cuối */}
      <div className="card border-dashed border-2 border-dark-700 hover:border-primary-600/50 transition-colors cursor-pointer">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-dark-800 rounded-xl flex items-center justify-center mb-4">
            <Plus size={32} className="text-dark-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Thêm Thành Viên Mới</h3>
          <p className="text-sm text-dark-400 text-center">
            Mời thành viên mới tham gia đội
          </p>
        </div>
      </div>
    </div>
  );
};

export default Members;