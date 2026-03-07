import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchCurrentUser } from '@/store/slices/authSlice';

interface PrivateRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string | string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, isInitialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  
  // Dùng thêm một state nội bộ để đảm bảo ít nhất đã chạy check Me một lần khi F5
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Nếu có currentUser trong storage nhưng chưa xác thực lại với server
      if (localStorage.getItem('currentUser') && !isInitialized) {
        await dispatch(fetchCurrentUser());
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch, isInitialized]);

  // 1. TRẠNG THÁI CHỜ: Khi đang fetch API Me để verify token
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-lion-dark text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-lion-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lion-text animate-pulse font-medium">Đang đồng bộ quyền hạn...</p>
        </div>
      </div>
    );
  }

  // 2. Sau khi đã check xong (isChecking = false) mà vẫn không có user
  if (!user) {
    // Lưu lại vị trí đang định vào để sau khi login quay lại đúng chỗ
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra Role
  const userRole = user.roleName;
  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!userRole || !rolesArray.includes(userRole)) {
      console.warn(`[Auth] Truy cập bị chặn. Role hiện tại: ${userRole}, Yêu cầu: ${allowedRoles}`);
      return <Navigate to="/403" replace />;
    }
  }

  // 4. Mọi thứ OK
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;