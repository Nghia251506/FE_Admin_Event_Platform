/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, Clock, MapPin, DollarSign, 
  ChevronLeft, ChevronRight, Loader2, 
  Plus, Tag
} from 'lucide-react';

import { 
  fetchMonthlySchedule, 
  fetchMonthlySummary, 
  fetchEventWithMembers, 
  assignMembersToEvent 
} from '@/store/slices/eventSlice';

// Tiêm Thunk từ userSlice theo ý ông giáo
import { fetchUsers } from '@/store/slices/userSlice'; 
import { RootState, AppDispatch } from '@/store/store';

import { CustomModal } from '@/global/modal/CustomModal';
import EventForm from '@/components/Event/EventForm';
import EventDetail from '@/components/Event/EventDetail';
import AssignMemberForm from '@/components/Event/AssignMemberForm';

const Schedule: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 1. Quản lý State điều hướng & Modal
  const [date, setDate] = useState(new Date()); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // 2. Lấy data từ Redux
  const { events, summary, loading, currentEventWithMembers } = useSelector((state: RootState) => state.events);
  
  // Lấy danh sách users từ userSlice (action fetchUsers trả về PageResponse nên mình lấy .content)
  const { users } = useSelector((state: RootState) => state.users);

  // 3. Effect: Gọi API theo tháng & Load danh sách anh em
  useEffect(() => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    dispatch(fetchMonthlySchedule({ month, year, page: 0 }));
    dispatch(fetchMonthlySummary({ month, year }));
    
    // Load anh em để gán vào show (Lấy size lớn để không bị sót người)
    dispatch(fetchUsers({ page: 0, size: 100 })); 
  }, [dispatch, date]);

  // 4. Handlers
  const handlePrevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1));
  const handleNextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1));

  const handleOpenDetail = (eventId: number) => {
    setSelectedEventId(eventId);
    dispatch(fetchEventWithMembers(eventId));
    setIsDetailOpen(true);
  };

  const handleOpenAssign = () => {
    setIsDetailOpen(false);
    setIsAssignOpen(true);
  };

  const onAssignSubmit = async (data: any) => {
    if (selectedEventId) {
      try {
        await dispatch(assignMembersToEvent({ id: selectedEventId, members: data })).unwrap();
        setIsAssignOpen(false);
        // Load lại chi tiết show để thấy danh sách vừa gán
        dispatch(fetchEventWithMembers(selectedEventId));
      } catch (err) {
        console.error("Lỗi gán nhân sự:", err);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1 flex items-center gap-3">
            Lịch Diễn
            <span className="text-[10px] bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full border border-primary-500/30 uppercase tracking-widest">Hệ Thống</span>
          </h1>
          <p className="text-dark-400 text-sm italic">Quản lý lịch trình và nhân sự đi show</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-primary-600 to-primary-400 text-white font-bold py-3 px-8 rounded-2xl flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary-900/20"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Lên Lịch Mới</span>
        </button>
      </div>

      {/* --- BỘ LỌC THÁNG & STATS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 card bg-dark-900/80 border-dark-700 flex flex-col justify-center items-center py-6 shadow-xl">
          <div className="flex items-center gap-6">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-dark-800 rounded-full text-dark-400 transition-colors"><ChevronLeft size={28} /></button>
            <div className="text-center min-w-[100px]">
              <span className="text-xs text-primary-500 font-bold uppercase tracking-tighter">Tháng {date.getMonth() + 1}</span>
              <h2 className="text-3xl font-display font-black text-white">{date.getFullYear()}</h2>
            </div>
            <button onClick={handleNextMonth} className="p-2 hover:bg-dark-800 rounded-full text-dark-400 transition-colors"><ChevronRight size={28} /></button>
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Tổng Show" value={summary?.totalEvents || 0} unit="Show" color="blue" />
          <StatCard title="Doanh Thu" value={formatCurrency(summary?.estimatedRevenue || 0)} unit="" color="accent" />
          <StatCard title="Hoàn Thành" value={`${summary?.completionRate || 0}%`} unit="" color="green" />
        </div>
      </div>

      {/* --- DANH SÁCH SHOW --- */}
      <div className="space-y-4">
        {loading && events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-dark-500 gap-4">
            <Loader2 className="animate-spin text-primary-500" size={48} />
            <p className="animate-pulse">Đang tải lịch diễn...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 card border-dashed border-dark-800 bg-transparent text-dark-500">
             <Calendar size={60} className="mx-auto mb-4 opacity-10" />
             <p className="font-medium">Chưa có show nào được ghi nhận trong tháng này.</p>
          </div>
        ) : (
          events.map((event) => (
            <div 
              key={event.id} 
              onClick={() => handleOpenDetail(event.id)}
              className="card bg-dark-900/40 hover:bg-dark-800/60 border-dark-800 hover:border-primary-500/50 transition-all group cursor-pointer relative overflow-hidden shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Badge Ngày */}
                <div className="flex flex-row md:flex-col items-center justify-center bg-dark-800 rounded-2xl p-4 min-w-[110px] border border-dark-700 group-hover:bg-dark-700 transition-colors">
                  <span className="text-4xl font-black text-white">{new Date(event.eventDate).getDate()}</span>
                  <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">T. {new Date(event.eventDate).getMonth() + 1}</span>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Tag size={14} className="text-primary-500" />
                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wider">{event.typeDisplayName}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{event.name}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(event.status)}`}>
                      {event.statusDisplayName}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-dark-300 text-sm bg-dark-800/50 p-2 rounded-lg">
                      <Clock size={16} className="text-primary-500" />
                      <span className="font-medium">{event.startTime.substring(0, 5)} - {event.endTime.substring(0, 5)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-dark-300 text-sm bg-dark-800/50 p-2 rounded-lg">
                      <MapPin size={16} className="text-accent-500" />
                      <span className="truncate max-w-[180px] font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary-400 font-bold bg-primary-500/5 p-2 rounded-lg border border-primary-500/10">
                      <DollarSign size={16} />
                      <span>{formatCurrency(event.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Thêm Show */}
      <CustomModal.ModalCreateAndEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lên Lịch Show Mới"
        size="lg"
        formContent={<EventForm onSuccess={() => setIsModalOpen(false)} />}
      />

      {/* 2. Chi tiết Show */}
      <CustomModal.ModalCreateAndEdit
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Chi Tiết Lịch Diễn"
        size="lg"
        formContent={
          <EventDetail 
            data={currentEventWithMembers} 
            onAssignClick={handleOpenAssign} 
          />
        }
      />

      {/* 3. Gán đội hình (Dùng list 'users' từ userSlice) */}
      <CustomModal.ModalCreateAndEdit
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Thiết Lập Đội Hình"
        size="md"
        formContent={
          <AssignMemberForm 
            eventId={selectedEventId || 0}
            membersList={users} // Dùng trực tiếp list user từ userSlice
            currentMembers={currentEventWithMembers?.members}
            loading={loading}
            onSubmit={onAssignSubmit}
          />
        }
      />
    </div>
  );
};

const StatCard = ({ title, value, unit, color }: any) => (
  <div className={`card bg-dark-900/50 border-${color}-500/20 shadow-lg`}>
    <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-black text-white">{value}</h3>
      <span className="text-xs text-dark-400">{unit}</span>
    </div>
  </div>
);

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'ACCEPTED': return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'COMPLETED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  }
};

export default Schedule;