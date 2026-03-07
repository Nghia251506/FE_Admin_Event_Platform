/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { addEvent } from '@/store/slices/eventSlice';
import { fetchCustomers, createCustomer } from '@/store/slices/customerSlice'; 
import { EventRequest } from '@/types/event';
import { CustomerRequest } from '@/types/customer';
import { toast } from 'react-toastify';
import { 
  Calendar, Clock, MapPin, User, Phone, DollarSign, 
  Tag, AlignLeft, ChevronDown, Plus, Search, Loader2 
} from 'lucide-react';

import { CustomModal } from '@/global/modal/CustomModal'; 
import CustomerForm from '@/components/Customer/CustomerForm';

interface EventFormProps {
  onSuccess: () => void;
}

const EVENT_TYPES = [
  { value: 'GRAND_OPENING', label: 'Khai Trương' },
  { value: 'WEDDING', label: 'Đám Cưới' },
  { value: 'MID_AUTUMN', label: 'Tết Trung Thu' },
  { value: 'LUNAR_NEW_YEAR', label: 'Tết Nguyên Đán' },
  { value: 'TEMPLE_CEREMONY', label: 'Cúng Đình/Miếu' },
  { value: 'LONGEVITY_WISH', label: 'Mừng Thọ' },
  { value: 'HOUSEWARMING', label: 'Tân Gia' },
  { value: 'CORPORATE_PARTY', label: 'Tiệc Công Ty' },
  { value: 'PRODUCT_LAUNCH', label: 'Ra Mắt Sản Phẩm' },
  { value: 'FESTIVAL', label: 'Lễ Hội' },
];

const InputGroup = ({ label, icon: Icon, children }: any) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-bold text-dark-400 uppercase ml-1 tracking-widest">{label}</label>
    <div className="flex items-center gap-3 bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 focus-within:border-primary-500/50 focus-within:ring-1 focus-within:ring-primary-500/20 transition-all relative">
      <Icon size={18} className="text-dark-500 shrink-0 pointer-events-none z-0" />
      <div className="flex-1 min-w-0 z-10 flex items-center">{children}</div>
    </div>
  </div>
);

const EventForm: React.FC<EventFormProps> = ({ onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  
  // States cho Customer
  const [customers, setCustomers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<EventRequest>({
    name: '',
    eventDate: '',
    location: '',
    description: '',
    startTime: '',
    endTime: '',
    customerId: null,
    customerName: '',
    customerPhone: '',
    type: 'GRAND_OPENING',
    totalAmount: 0,
  });

  // Xử lý click outside để đóng dropdown khách hàng
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format Time HH:mm -> HH:mm:ss để Java LocalTime không báo lỗi
  const formatTimeToBackend = (timeStr: string) => {
    if (!timeStr) return '';
    return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  };

  const loadCustomers = async (keyword: string, pageNum: number, isNewSearch: boolean) => {
    setIsSearching(true);
    try {
      const result = await dispatch(fetchCustomers({ keyword, page: pageNum, size: 10 })).unwrap();
      if (isNewSearch) {
        setCustomers(result.content);
      } else {
        setCustomers(prev => [...prev, ...result.content]);
      }
      setHasMore(!result.empty && result.number < result.totalPages - 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      loadCustomers(searchKey, 0, true);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchKey]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !isSearching) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadCustomers(searchKey, nextPage, false);
    }
  };

  const selectCustomer = (c: any) => {
    setFormData(prev => ({
      ...prev,
      customerId: c.id,
      customerName: c.fullName || c.name,
      customerPhone: c.phone
    }));
    setShowDropdown(false);
    setSearchKey('');
  };

  const handleQuickCreateCustomer = async (customerData: CustomerRequest) => {
    setCustomerLoading(true);
    try {
      const newCustomer = await dispatch(createCustomer(customerData)).unwrap();
      toast.success("Đã thêm khách hàng mới!");
      selectCustomer(newCustomer);
      setIsCustomerModalOpen(false);
    } catch (err: any) {
      toast.error(err || "Lỗi khi tạo khách");
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Chuẩn bị payload chuẩn LocalTime
    const payload = {
      ...formData,
      startTime: formatTimeToBackend(formData.startTime),
      endTime: formatTimeToBackend(formData.endTime)
    };

    try {
      await dispatch(addEvent(payload)).unwrap();
      toast.success("Lên lịch thành công! 🐲");
      onSuccess();
    } catch (err: any) {
        toast.error(err?.message || "Lỗi khi tạo sự kiện");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .clean-input { background: transparent; border: none; outline: none; width: 100%; color: white; font-size: 14px; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
      `}</style>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* CỘT 1: THÔNG TIN SHOW */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-primary-500 uppercase border-l-2 border-primary-500 pl-2 tracking-tighter">Thông tin Show</h4>
            <InputGroup label="Tên sự kiện" icon={Calendar}>
              <input required name="name" value={formData.name} onChange={handleChange} className="clean-input" placeholder="Ví dụ: Khai trương Spa..." />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Loại hình" icon={Tag}>
                <div className="relative w-full">
                  <select name="type" value={formData.type} onChange={handleChange} className="clean-input cursor-pointer pr-6 relative z-10 appearance-none">
                    {EVENT_TYPES.map(t => <option key={t.value} value={t.value} className="bg-dark-900">{t.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none" />
                </div>
              </InputGroup>
              <InputGroup label="Tổng tiền" icon={DollarSign}>
                <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} className="clean-input text-primary-400 font-bold" />
              </InputGroup>
            </div>

            <InputGroup label="Địa điểm" icon={MapPin}>
              <input required name="location" value={formData.location} onChange={handleChange} className="clean-input" placeholder="Địa chỉ diễn..." />
            </InputGroup>
            
            <InputGroup label="Ghi chú" icon={AlignLeft}>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="clean-input resize-none" placeholder="Yêu cầu thêm..." />
            </InputGroup>
          </div>

          {/* CỘT 2: KHÁCH HÀNG & THỜI GIAN */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-accent-500 uppercase border-l-2 border-accent-500 pl-2 tracking-tighter">Khách hàng & Thời gian</h4>
            
            <div className="relative" ref={dropdownRef}>
              <InputGroup label="Tìm khách hàng" icon={Search}>
                <div className="flex items-center w-full">
                  <input 
                    className="clean-input" 
                    placeholder="Tên hoặc Số điện thoại..." 
                    value={searchKey}
                    onChange={(e) => { setSearchKey(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  <button 
                    type="button"
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="ml-2 p-1.5 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-lg transition-all active:scale-90"
                  >
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </InputGroup>

              {showDropdown && (
                <div onScroll={handleScroll} className="absolute z-[110] w-full mt-2 bg-dark-800 border border-dark-700 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
                  <div className="max-h-[220px] overflow-y-auto custom-scroll">
                    {customers.length === 0 && !isSearching && (
                      <div className="p-4 text-center text-dark-500 text-sm italic">Không tìm thấy khách hàng...</div>
                    )}
                    {customers.map((c) => (
                      <div key={c.id} onClick={() => selectCustomer(c)} className="p-3 hover:bg-primary-500/10 cursor-pointer border-b border-dark-700/50 flex justify-between items-center group transition-colors">
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-primary-400">{c.fullName}</div>
                          <div className="text-[10px] text-dark-400 tracking-wider">{c.phone}</div>
                        </div>
                        <div className="text-[9px] bg-dark-700 px-2 py-0.5 rounded text-dark-300">ID: {c.id}</div>
                      </div>
                    ))}
                    {isSearching && <div className="p-3 flex justify-center"><Loader2 size={18} className="animate-spin text-primary-500" /></div>}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Khách hàng" icon={User}>
                <div className="text-sm text-primary-400 font-bold truncate">
                  {formData.customerName || <span className="text-dark-600 font-normal italic">Chưa chọn...</span>}
                </div>
              </InputGroup>
              <InputGroup label="SĐT" icon={Phone}>
                <div className="text-sm text-primary-400 font-bold">
                  {formData.customerPhone || <span className="text-dark-600">...</span>}
                </div>
              </InputGroup>
            </div>

            <InputGroup label="Ngày diễn" icon={Calendar}>
              <input required type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="clean-input [color-scheme:dark]" />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Bắt đầu" icon={Clock}>
                <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="clean-input [color-scheme:dark]" />
              </InputGroup>
              <InputGroup label="Kết thúc" icon={Clock}>
                <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="clean-input [color-scheme:dark]" />
              </InputGroup>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-dark-800">
          <button type="button" onClick={onSuccess} className="px-6 py-2.5 rounded-xl text-dark-400 font-bold hover:bg-dark-800 transition-all active:scale-95">Hủy</button>
          <button type="submit" disabled={loading} className="px-8 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl active:scale-95 disabled:opacity-50 min-w-[160px] flex justify-center">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Xác nhận lên lịch'}
          </button>
        </div>
      </form>

      <CustomModal.ModalCreateAndEdit
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Thêm khách hàng nhanh"
        size="md"
        formContent={
          <CustomerForm 
            onSubmit={handleQuickCreateCustomer} 
            loading={customerLoading} 
          />
        }
      />
    </>
  );
};

export default EventForm;