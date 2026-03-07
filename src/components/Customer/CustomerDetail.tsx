import React from 'react';
import { User, Phone, MapPin, FileText, ShieldCheck, Calendar } from 'lucide-react';
import { CustomerResponse } from '@/types/customer';

interface CustomerDetailProps {
  customer: CustomerResponse;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="flex items-center gap-4 p-4 bg-dark-800 rounded-2xl border border-dark-700">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-2xl font-bold text-white">
          {customer.fullName.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{customer.fullName}</h2>
          <p className="text-primary-400 text-sm font-medium">Khách hàng hệ thống</p>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1 p-3 bg-dark-800/50 rounded-xl border border-dark-800">
          <p className="text-xs text-dark-500 flex items-center gap-1">
            <Phone size={12} /> Số điện thoại
          </p>
          <p className="text-white font-medium">{customer.phone}</p>
        </div>
        <div className="space-y-1 p-3 bg-dark-800/50 rounded-xl border border-dark-800">
          <p className="text-xs text-dark-500 flex items-center gap-1">
            <ShieldCheck size={12} /> Người quản lý
          </p>
          <p className="text-accent-400 font-medium">{customer.assignedToName}</p>
        </div>
      </div>

      {/* Địa chỉ */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-dark-400 flex items-center gap-2">
          <MapPin size={16} className="text-primary-500" /> Địa chỉ liên hệ
        </p>
        <div className="p-4 bg-dark-800 rounded-xl border border-dark-700 text-dark-200">
          {customer.address || "Chưa cập nhật địa chỉ"}
        </div>
      </div>

      {/* Ghi chú */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-dark-400 flex items-center gap-2">
          <FileText size={16} className="text-primary-500" /> Ghi chú nội bộ
        </p>
        <div className="p-4 bg-dark-800 rounded-xl border border-dark-700 text-dark-200 italic">
          "{customer.note || "Không có ghi chú đặc biệt cho khách hàng này."}"
        </div>
      </div>

      <div className="pt-4 border-t border-dark-800 flex justify-end">
        <p className="text-[10px] text-dark-500">Ngày đăng ký: {new Date().toLocaleDateString('vi-VN')}</p>
      </div>
    </div>
  );
};

export default CustomerDetail;