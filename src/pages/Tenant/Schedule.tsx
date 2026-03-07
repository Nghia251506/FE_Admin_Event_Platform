import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, Clock, MapPin, DollarSign, 
  Filter, ChevronLeft, ChevronRight, Loader2, 
  Plus
} from 'lucide-react';
import { fetchEvents, fetchMonthlySummary } from '@/store/slices/eventSlice';
import { RootState, AppDispatch } from '@/store/store';

const Schedule: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 1. Quản lý State: Để trống new Date() để mặc định lấy tháng/năm hiện tại của máy tính
  const [date, setDate] = useState(new Date()); 
  
  // 2. Lấy data từ Redux
  const { events, summary, loading } = useSelector((state: RootState) => state.events);
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Kiểm tra quyền Admin/Quản lý để gọi API tương ứng
  const isAdmin = user?.roleName === 'ADMIN' || user?.roleName === 'TN_MEMBER';

  // 3. Effect: Tự động gọi lại API mỗi khi 'date' (Tháng/Năm) thay đổi
  useEffect(() => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Gọi danh sách sự kiện
    dispatch(fetchEvents({ 
      isAdmin, 
      params: { month, year, page: 0, size: 50 } // Tăng size lên tí cho bõ công lướt
    }));
    
    // Gọi tóm tắt thống kê tháng
    dispatch(fetchMonthlySummary({ isAdmin, month, year }));
  }, [dispatch, date, isAdmin]);

  // 4. Logic chuyển tháng (Immutability: tạo object Date mới để trigger re-render)
  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1));
  };

  const formatMonthDisplay = () => {
    return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  // Helper định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-2">
            Lịch Diễn <span className="text-sm font-normal text-dark-500 bg-dark-800 px-2 py-1 rounded">Beta</span>
          </h1>
          <p className="text-dark-400">Theo dõi dòng chảy sự kiện của đội lân</p>
        </div>
        <button 
          onClick={() => {/* Logic mở Modal thêm mới */}}
          className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Thêm Lịch Diễn</span>
        </button>
      </div>

      {/* Calendar Navigation & Filters */}
      <div className="card border-dark-800 bg-dark-900/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Bộ điều hướng tháng */}
          <div className="flex items-center gap-6">
            <button 
              onClick={handlePrevMonth} 
              className="p-3 hover:bg-dark-800 text-dark-400 hover:text-primary-500 rounded-full transition-all border border-transparent hover:border-dark-700"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center min-w-[180px]">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                {formatMonthDisplay()}
              </h2>
              {loading && <span className="text-[10px] text-primary-500 uppercase tracking-widest animate-pulse">Đang đồng bộ...</span>}
            </div>
            <button 
              onClick={handleNextMonth} 
              className="p-3 hover:bg-dark-800 text-dark-400 hover:text-primary-500 rounded-full transition-all border border-transparent hover:border-dark-700"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none btn-secondary flex items-center justify-center gap-2 text-sm py-2.5 px-4 border-dark-700">
              <Filter size={18} />
              <span>Lọc nâng cao</span>
            </button>
            <button className="flex-1 lg:flex-none px-4 py-2.5 bg-accent-600/10 text-accent-400 border border-accent-600/20 rounded-lg hover:bg-accent-600 hover:text-white transition-all text-sm font-medium">
              Xuất PDF/Excel
            </button>
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-4">
        {loading && events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-dark-500">
            <Loader2 className="animate-spin mb-4 text-primary-500" size={40} />
            <p>Đang tra cứu lịch diễn...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 card border-dashed border-dark-700 bg-transparent">
            <Calendar size={48} className="mx-auto text-dark-600 mb-4 opacity-20" />
            <p className="text-dark-400 font-medium">Tháng này chưa có lịch diễn nào được ghi nhận</p>
            <button onClick={() => setDate(new Date())} className="mt-4 text-primary-500 text-sm hover:underline">Về tháng hiện tại</button>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="card hover:border-primary-600/40 transition-all cursor-pointer group relative overflow-hidden">
              {/* Trang trí nhẹ ở góc nếu show đã xác nhận */}
              {event.status === 'ACCEPTED' && (
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div className="absolute transform rotate-45 bg-green-500/10 text-green-500 text-[10px] font-bold py-1 right-[-35px] top-[15px] w-[120px] text-center uppercase tracking-tighter">
                    Confirmed
                  </div>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-5">
                {/* Date Badge */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-dark-800 border border-dark-700 rounded-2xl flex flex-col items-center justify-center group-hover:border-primary-600/50 transition-colors">
                    <span className="text-3xl font-display font-bold text-white">
                      {new Date(event.eventDate).getDate()}
                    </span>
                    <span className="text-xs font-bold text-primary-500 uppercase">
                      T{new Date(event.eventDate).getMonth() + 1}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors mb-1">
                        {event.name}
                      </h3>
                      <div className="flex items-center gap-2 text-dark-400">
                        <span className="bg-dark-700 text-[10px] px-2 py-0.5 rounded text-dark-200 uppercase font-bold tracking-wider">
                          {event.customerName || 'Khách lẻ'}
                        </span>
                        <span className="text-sm">• {event.customerPhone}</span>
                      </div>
                    </div>
                    <div className={`self-start badge py-1 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      event.status === 'ACCEPTED' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      {event.status === 'ACCEPTED' ? 'Đã xác nhận' : 'Chờ duyệt'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-3 text-dark-300">
                      <div className="p-2 bg-dark-800 rounded-lg"><Clock size={16} className="text-primary-500" /></div>
                      <span className="text-sm font-medium">{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-dark-300">
                      <div className="p-2 bg-dark-800 rounded-lg"><MapPin size={16} className="text-accent-500" /></div>
                      <span className="text-sm font-medium truncate max-w-[200px]">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-primary-400 font-bold bg-primary-500/5 p-2 rounded-lg border border-primary-500/10">
                      <DollarSign size={18} />
                      <span>{formatCurrency(event.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Monthly Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-600/5 to-transparent border-blue-600/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500"><Calendar size={24} /></div>
            <div>
              <p className="text-xs text-dark-400 uppercase font-bold tracking-widest">Số lượng show</p>
              <h3 className="text-3xl font-display font-bold text-white">{summary?.totalEvents || 0}</h3>
            </div>
          </div>
          <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[70%]" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-accent-600/5 to-transparent border-accent-600/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-accent-600/20 rounded-xl text-accent-500"><DollarSign size={24} /></div>
            <div>
              <p className="text-xs text-dark-400 uppercase font-bold tracking-widest">Doanh thu dự kiến</p>
              <h3 className="text-3xl font-display font-bold text-white">
                ₫{(summary?.estimatedRevenue || 0) / 1000000}M
              </h3>
            </div>
          </div>
          <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-accent-500 h-full w-[45%]" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-600/5 to-transparent border-green-600/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-600/20 rounded-xl text-green-500"><Clock size={24} /></div>
            <div>
              <p className="text-xs text-dark-400 uppercase font-bold tracking-widest">Hiệu suất đội</p>
              <h3 className="text-3xl font-display font-bold text-white">{summary?.completionRate || 0}%</h3>
            </div>
          </div>
          <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[90%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;