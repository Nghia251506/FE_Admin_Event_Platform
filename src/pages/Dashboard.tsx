import React from 'react';
import {
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Palmtree,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'Tổng Sự Kiện',
      value: '142',
      change: '+12.5%',
      trend: 'up',
      icon: <Calendar size={24} />,
      color: 'from-blue-600 to-blue-700',
    },
    {
      label: 'Đội Lân Hoạt Động',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: <Palmtree size={24} />,
      color: 'from-green-600 to-green-700',
    },
    {
      label: 'Khách Hàng',
      value: '356',
      change: '+8.2%',
      trend: 'up',
      icon: <Users size={24} />,
      color: 'from-purple-600 to-purple-700',
    },
    {
      label: 'Doanh Thu Tháng',
      value: '₫285M',
      change: '+15.3%',
      trend: 'up',
      icon: <DollarSign size={24} />,
      color: 'from-primary-600 to-gold-600',
    },
  ];

  const recentEvents = [
    {
      id: 1,
      name: 'Khai Trương Showroom Mercedes',
      date: '15/02/2024',
      customer: 'Mercedes-Benz VN',
      team: 'Đội Rồng Vàng',
      status: 'completed',
      amount: '₫45,000,000',
    },
    {
      id: 2,
      name: 'Lễ Động Thổ Dự Án Vinhomes',
      date: '18/02/2024',
      customer: 'Vingroup',
      team: 'Đội Phượng Hoàng',
      status: 'scheduled',
      amount: '₫65,000,000',
    },
    {
      id: 3,
      name: 'Tiệc Tất Niên Công Ty FPT',
      date: '20/02/2024',
      customer: 'FPT Corporation',
      team: 'Đội Kỳ Lân',
      status: 'scheduled',
      amount: '₫38,000,000',
    },
    {
      id: 4,
      name: 'Lễ Khai Trương Chi Nhánh Mới',
      date: '12/02/2024',
      customer: 'Sacombank',
      team: 'Đội Rồng Xanh',
      status: 'completed',
      amount: '₫42,000,000',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Dashboard
        </h1>
        <p className="text-dark-400">
          Tổng quan về hoạt động kinh doanh và sự kiện
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <span className="text-white">{stat.icon}</span>
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-dark-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} className="text-primary-500" />
            <h2 className="text-xl font-display font-bold text-white">
              Sự Kiện Gần Đây
            </h2>
          </div>
          <button className="text-sm text-primary-500 hover:text-primary-400 font-medium">
            Xem tất cả →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-800">
                <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">
                  Tên Sự Kiện
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">
                  Ngày
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">
                  Khách Hàng
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">
                  Đội
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-dark-400">
                  Trạng Thái
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-dark-400">
                  Số Tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-white">
                      {event.name}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-dark-300">{event.date}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-dark-300">{event.customer}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-dark-300">{event.team}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {event.status === 'completed'
                        ? 'Hoàn thành'
                        : 'Đã lên lịch'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-semibold text-gold-500">
                      {event.amount}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:border-primary-600/50 transition-colors cursor-pointer">
          <Calendar size={32} className="text-primary-500 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Tạo Sự Kiện Mới</h3>
          <p className="text-sm text-dark-400">
            Thêm sự kiện mới vào hệ thống
          </p>
        </div>
        <div className="card hover:border-gold-600/50 transition-colors cursor-pointer">
          <Palmtree size={32} className="text-gold-500 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Quản Lý Đội Lân</h3>
          <p className="text-sm text-dark-400">Xem và cập nhật thông tin đội</p>
        </div>
        <div className="card hover:border-green-600/50 transition-colors cursor-pointer">
          <Users size={32} className="text-green-500 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Khách Hàng Mới</h3>
          <p className="text-sm text-dark-400">Thêm khách hàng vào danh sách</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
