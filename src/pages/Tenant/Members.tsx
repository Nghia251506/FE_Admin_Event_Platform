/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, Plus, Phone, Mail, Award, Calendar, 
  ChevronLeft, ChevronRight, Loader2 
} from 'lucide-react';

import { fetchUsers } from '@/store/slices/userSlice';
import { AppDispatch, RootState } from '@/store/store';

import { CustomModal } from '@/global/modal/CustomModal';
import UserForm from "@/components/User/UserForm";

const Members: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // State quản lý phân trang và Modal
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const pageSize = 4; // Chỉnh lên 6 cho grid đều đẹp

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

  // Sau khi thêm user thành công
  const handleAddSuccess = () => {
    setIsAddUserModalOpen(false);
    dispatch(fetchUsers({ page: currentPage - 1, size: pageSize })); // Refresh lại danh sách
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Quản Lý Thành Viên
          </h1>
          <p className="text-dark-400">Danh sách và thông tin anh em trong đội</p>
        </div>
        <button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-gradient-to-r from-primary-600 to-primary-400 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary-900/20"
        >
          <Plus size={20} />
          <span>Thêm Thành Viên</span>
        </button>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users size={24} className="text-primary-500" />} value={totalCount} title="Tổng thành viên" />
        <StatCard icon={<div className="w-6 h-6 bg-green-500 rounded-full" />} value="8" title="Đang hoạt động" />
        <StatCard icon={<Award size={24} className="text-accent-500" />} value="4.8" title="Đánh giá trung bình" />
        <StatCard icon={<Calendar size={24} className="text-green-500" />} value="156" title="Show đã diễn" />
      </div>

      {/* Loading State / Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-primary-500">
          <Loader2 className="animate-spin mb-2" size={40} />
          <p className="text-dark-400">Đang tải danh sách anh em...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {members.map((member: any) => (
              <div
                key={member.id}
                className="card hover:border-primary-600/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-dark-700 to-dark-800 rounded-xl flex items-center justify-center text-4xl relative border border-dark-600">
                      {member.avatar || (member.gender === 'female' ? '👩' : '👨')}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-dark-900 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                          {member.fullName}
                        </h3>
                        <p className="text-xs text-dark-500 font-medium uppercase tracking-wider">{member.roleName || 'Thành viên'}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-dark-800 px-2 py-1 rounded-lg">
                        <Award size={14} className="text-yellow-500" />
                        <span className="text-xs font-bold text-white">
                          {member.rating || '5.0'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 mb-3">
                      <div className="flex items-center gap-2 text-xs text-dark-400">
                        <Phone size={12} className="text-primary-500" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-dark-400">
                        <Mail size={12} className="text-primary-500" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-dark-800">
                      <div className="text-[10px] text-dark-500 uppercase font-bold tracking-widest">
                        Thâm niên: <span className="text-primary-400">{member.seniority || 0} Năm</span>
                      </div>
                      <div className="text-[10px] text-dark-500 uppercase font-bold tracking-widest">
                        Username: <span className="text-white">{member.username}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Member Card Inline */}
            {/* <div 
              onClick={() => setIsAddUserModalOpen(true)}
              className="card border-dashed border-2 border-dark-700 hover:border-primary-600/50 hover:bg-primary-600/5 transition-all cursor-pointer flex flex-col items-center justify-center py-8 group"
            >
              <div className="w-12 h-12 bg-dark-800 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-dark-400 group-hover:text-primary-500" />
              </div>
              <h3 className="text-sm font-bold text-white">Thêm Thành Viên</h3>
            </div> */}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pb-10">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl bg-dark-800 text-white disabled:opacity-20 hover:bg-dark-700 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-11 h-11 rounded-xl font-bold transition-all ${
                    currentPage === idx + 1 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                    : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl bg-dark-800 text-white disabled:opacity-20 hover:bg-dark-700 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL THÊM THÀNH VIÊN */}
      <CustomModal.ModalCreateAndEdit
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Thêm Thành Viên Mới"
        size="lg"
        formContent={<UserForm onSuccess={handleAddSuccess} />}
      />
    </div>
  );
};

// --- Helper StatCard ---
const StatCard = ({ icon, value, title }: any) => (
  <div className="card bg-dark-900/50 border-dark-800">
    <div className="mb-3">{icon}</div>
    <h3 className="text-2xl font-black text-white mb-1">{value}</h3>
    <p className="text-[10px] uppercase font-bold text-dark-500 tracking-widest">{title}</p>
  </div>
);

export default Members;