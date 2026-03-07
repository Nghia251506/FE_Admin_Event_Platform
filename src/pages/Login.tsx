import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser(formData));
    
    if (loginUser.fulfilled.match(resultAction)) {
      const user = resultAction.payload;
      // Phân luồng sau login dựa trên role mà ae mình đã bàn
      if (user.roleName === 'SUPER_ADMIN') {
        navigate('/admin/');
      } else {
        navigate('/tenant/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-lion-dark flex items-center justify-center p-4">
      {/* Background Decor - Tạo hiệu ứng mờ ảo cho xịn */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-lion-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-lion-orange/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-lion-primary to-lion-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Lion<span className="text-lion-orange">Dance</span>
            </h1>
          </div>
          <p className="text-lion-text italic">Hệ thống quản lý sự kiện chuyên nghiệp</p>
        </div>

        {/* Login Card */}
        <div className="bg-lion-card border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-lion-text mb-2">Tên đăng nhập</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-lion-text/50" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 bg-lion-dark border border-white/10 rounded-xl text-white placeholder-lion-text/30 focus:outline-none focus:ring-2 focus:ring-lion-primary/50 transition-all"
                  placeholder="admin@haoanh.com"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-lion-text mb-2">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-lion-text/50" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="block w-full pl-10 pr-10 py-3 bg-lion-dark border border-white/10 rounded-xl text-white placeholder-lion-text/30 focus:outline-none focus:ring-2 focus:ring-lion-primary/50 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-lion-text/50 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-400 text-sm text-center font-medium"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-lion-primary to-lion-orange hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lion-primary transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'ĐĂNG NHẬP HỆ THỐNG'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-lion-text">
              Bạn là đơn vị mới?{' '}
              <button className="text-lion-orange hover:underline font-medium">Đăng ký Tenant</button>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center mt-8 text-xs text-lion-text/40">
          © 2026 LionDance Pro - Version 1.0.0
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;