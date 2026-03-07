/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  UserPlus, User, Lock, Mail, Phone, 
  Award, ShieldCheck, Loader2, CheckCircle2 
} from 'lucide-react';
import { createUser } from '@/store/slices/userSlice';
import { AppDispatch, RootState } from '@/store/store';

interface UserFormProps {
  onSuccess?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.users);

  // Khởi tạo state theo interface CreateUser của ông
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: '',
    seniority: 0,
    roleId: 7 // Mặc định là TN_MEMBER như ông giáo yêu cầu
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seniority' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Dispatch thunk createUser
      await dispatch(createUser(formData)).unwrap();
      // Nếu thành công thì gọi callback onSuccess (để đóng modal)
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err || "Có lỗi xảy ra khi tạo thành viên");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2">
          <ShieldCheck size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-dark-500 uppercase ml-1 tracking-widest">Tên đăng nhập</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="vanduong_01"
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:border-primary-500 outline-none transition-all placeholder:text-dark-600"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-dark-500 uppercase ml-1 tracking-widest">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-dark-500 uppercase ml-1 tracking-widest">Họ và tên</label>
          <div className="relative">
            <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn Dương"
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-dark-500 uppercase ml-1 tracking-widest">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="duong@example.com"
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-dark-500 uppercase ml-1 tracking-widest">Số điện thoại</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0987xxxxxx"
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Seniority */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-dark-500 uppercase ml-1 tracking-widest">Thâm niên (năm)</label>
          <div className="relative">
            <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input
              type="number"
              name="seniority"
              value={formData.seniority}
              onChange={handleChange}
              min="0"
              className="w-full bg-dark-800 border border-dark-700 text-white rounded-xl py-2.5 pl-10 pr-4 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Role Badge (Chỉ hiển thị cho admin biết là đang thêm Member) */}
      <div className="flex items-center gap-2 p-3 bg-primary-500/5 border border-primary-500/10 rounded-xl">
        <ShieldCheck size={16} className="text-primary-500" />
        <span className="text-xs text-dark-400">Quyền hạn mặc định: </span>
        <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">TN_MEMBER (ID: 7)</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-primary-600 to-primary-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(234,68,68,0.2)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <UserPlus size={20} />
              <span>Thêm Thành Viên</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;