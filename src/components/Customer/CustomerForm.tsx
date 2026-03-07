import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, FileText, Save } from 'lucide-react';
import { CustomerRequest, CustomerResponse } from '@/types/customer';

interface CustomerFormProps {
  initialData?: CustomerResponse | null;
  onSubmit: (data: CustomerRequest) => void;
  loading?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState<CustomerRequest>({
    fullName: '',
    phone: '',
    address: '',
    note: '',
  });

  // Khi mở Modal Sửa, đổ dữ liệu cũ vào Form
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        phone: initialData.phone,
        address: initialData.address || '',
        note: initialData.note || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      {/* Họ tên */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-400 flex items-center gap-2">
          <User size={16} /> Họ và tên khách hàng
        </label>
        <input
          required
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Ví dụ: Nguyễn Văn A"
          className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
        />
      </div>

      {/* Số điện thoại */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-400 flex items-center gap-2">
          <Phone size={16} /> Số điện thoại
        </label>
        <input
          required
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Ví dụ: 0987654321"
          className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
        />
      </div>

      {/* Địa chỉ */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-400 flex items-center gap-2">
          <MapPin size={16} /> Địa chỉ
        </label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Nhập địa chỉ khách hàng..."
          className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
        />
      </div>

      {/* Ghi chú */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-400 flex items-center gap-2">
          <FileText size={16} /> Ghi chú đặc biệt
        </label>
        <textarea
          name="note"
          rows={3}
          value={formData.note}
          onChange={handleChange}
          placeholder="Lưu ý về khách hàng này (VD: Khách quen, hay bo thêm...)"
          className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 flex items-center justify-center gap-2 h-12"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} />
              <span>{initialData ? 'Cập nhật thông tin' : 'Lưu khách hàng'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;