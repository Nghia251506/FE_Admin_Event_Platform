import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Filter, Calendar, MapPin, Loader2, User } from 'lucide-react';
import { fetchEvents } from '@/store/slices/eventSlice';
import { RootState, AppDispatch } from '@/store/store';

const Events: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 1. Lấy data từ Redux Store
  const { events, loading } = useSelector((state: RootState) => state.events);
  
  // 2. State cho tìm kiếm tại chỗ (Local Search)
  const [searchTerm, setSearchTerm] = useState('');

  // 3. Gọi API khi component mount
  useEffect(() => {
    const now = new Date();
    dispatch(fetchEvents({
      isAdmin: false, // Đây là Admin sàn nên luôn là true
      params: { 
        month: now.getMonth() + 1, 
        year: now.getFullYear(), 
        page: 0, 
        size: 50 // Admin cần xem nhiều nên lấy limit cao hơn chút
      }
    }));
  }, [dispatch]);

  // 4. Logic lọc dữ liệu theo search term (Tên sự kiện hoặc khách hàng)
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Quản Lý Sự Kiện
          </h1>
          <p className="text-dark-400">
            Hệ thống quản lý tất cả lịch trình biểu diễn trên toàn sàn
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Tạo Sự Kiện</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
              />
              <input
                type="text"
                placeholder="Tìm tên sự kiện, khách hàng..."
                className="input-field w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            <span>Lọc nâng cao</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary-500" size={40} />
          <p className="text-dark-400">Đang tải dữ liệu sự kiện...</p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="card hover:border-primary-600/50 transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      event.status === 'COMPLETED'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {event.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã lên lịch'}
                  </span>
                  <span className="text-[10px] text-dark-500 font-bold uppercase tracking-widest bg-dark-800 px-2 py-1 rounded">
                    {event.typeDisplayName || 'SỰ KIỆN'}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors line-clamp-2">
                    {event.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <Calendar size={16} className="text-primary-500" />
                      <span>
                        {new Date(event.eventDate).toLocaleDateString('vi-VN')} • {event.startTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <MapPin size={16} className="text-accent-500" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-800 mt-auto">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                      <p className="text-[10px] text-dark-500 uppercase mb-1">Khách hàng</p>
                      <div className="flex items-center gap-1">
                         <User size={12} className="text-dark-400" />
                         <p className="text-dark-200 font-medium truncate max-w-[100px]">
                           {event.customerName || 'N/A'}
                         </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col">
                      <p className="text-[10px] text-dark-500 uppercase mb-1">Doanh thu</p>
                      <p className="text-primary-400 font-bold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(event.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center card border-dashed border-dark-700">
               <p className="text-dark-500 text-lg">Không tìm thấy sự kiện nào trong hệ thống.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;