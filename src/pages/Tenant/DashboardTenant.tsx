import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, Users, DollarSign, TrendingUp, Clock, 
  MapPin, Star, ArrowUpRight, Loader2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { AppDispatch, RootState } from '@/store/store';
import { fetchDashboardSummary } from '@/store/slices/dashboardSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  // Hàm format tiền tệ
  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-dark-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
        <p>Đang tải dữ liệu "giang sơn" đội lân...</p>
      </div>
    );
  }

  if (error) {
    return <div className="card border-red-500/50 text-red-400 p-6 text-center">{error}</div>;
  }

  if (!data) return null;

  // Giả lập data cho Chart dựa trên monthlyEvents thực tế (hoặc ông giáo có thể mở rộng API sau)
  const chartData = [
    { name: 'T1', events: 4 },
    { name: 'T2', events: 7 },
    { name: 'Tháng này', events: data.monthlyEvents },
  ];

  const stats = [
    {
      label: 'Lịch Diễn Tháng Này',
      value: data.monthlyEvents.toString(),
      change: 'Show thực tế',
      trend: 'up',
      icon: <Calendar size={24} />,
      color: 'from-blue-600 to-blue-700',
    },
    {
      label: 'Thành Viên Đội',
      value: data.activeMemberRatio,
      change: 'Đang sẵn sàng',
      trend: 'up',
      icon: <Users size={24} />,
      color: 'from-green-600 to-green-700',
    },
    {
      label: 'Thu Nhập Tháng',
      value: formatVND(data.monthlyRevenue),
      change: 'Doanh thu tạm tính',
      trend: 'up',
      icon: <DollarSign size={24} />,
      color: 'from-primary-600 to-primary-700',
    },
    {
      label: 'Đánh Giá',
      value: data.averageRating.toString(),
      change: 'Uy tín đội lân',
      trend: 'up',
      icon: <Star size={24} />,
      color: 'from-accent-600 to-accent-700',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-primary-600/20 to-accent-600/20 border-primary-600/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Chào mừng trở lại, Đội Rồng Vàng! 🐉
            </h1>
            <p className="text-dark-300">
              Hệ thống đã sẵn sàng cho <span className="text-primary-400 font-bold">{data.upcomingEvents.length} lịch diễn</span> sắp tới.
            </p>
          </div>
          <div className="hidden md:block text-6xl">🎭</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <span className="text-white">{stat.icon}</span>
              </div>
              <ArrowUpRight size={16} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-dark-400 mb-1">{stat.label}</p>
            <p className="text-xs text-green-400">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={24} className="text-primary-500" />
              <h2 className="text-xl font-display font-bold text-white">Lịch Diễn Sắp Tới</h2>
            </div>
          </div>

          <div className="space-y-4">
            {data.upcomingEvents.length > 0 ? (
              data.upcomingEvents.map((event) => (
                <div key={event.id} className="bg-dark-800 border border-dark-700 rounded-lg p-4 hover:border-primary-600/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-bold mb-1">{event.name}</h3>
                      <p className="text-sm text-dark-400">{event.clientName}</p>
                    </div>
                    <span className={`badge ${event.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {event.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-dark-400">
                      <Clock size={14} />
                      <span>{new Date(event.startTime).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-dark-400">
                      <MapPin size={14} />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-dark-400 py-10 italic">Chưa có show diễn nào sắp tới.</p>
            )}
          </div>
        </div>

        {/* Team Status */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Users size={24} className="text-accent-500" />
            <h2 className="text-xl font-display font-bold text-white">Đội Ngũ</h2>
          </div>

          <div className="space-y-3">
            {data.teamStatus.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center text-xl">
                    {member.avatar || '🐉'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{member.fullName}</p>
                    <p className="text-xs text-dark-500">{member.roleName}</p>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full ${member.status === 'ACTIVE' ? 'bg-green-500 animate-pulse-slow' : 'bg-yellow-500'}`}></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Section - Sự tăng trưởng sự kiện */}
      <div className="card min-h-[350px]">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={24} className="text-blue-500" />
          <h2 className="text-xl font-display font-bold text-white">Thống Kê Sự Kiện Theo Tháng</h2>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#1F2937'}}
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#F97316' }}
              />
              <Bar dataKey="events" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 2 ? '#F97316' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;