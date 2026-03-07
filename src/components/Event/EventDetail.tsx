/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, Clock, MapPin, User, Phone, DollarSign, 
  Info, Users, CheckCircle2, AlertCircle, Timer, Save, XCircle,
  Loader2
} from 'lucide-react';
import { EventWithMembersResponse } from '@/types/event';
import { updateEventConcentrate, fetchEventWithMembers } from '@/store/slices/eventSlice';
import { AppDispatch, RootState } from '@/store/store';

interface EventDetailProps {
  data: EventWithMembersResponse | null;
  onAssignClick: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ data, onAssignClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.events);
  
  // State quản lý việc sửa thông tin tập trung
  const [isEditing, setIsEditing] = useState(false);
  const [concentrateData, setConcentrateData] = useState({
    concentrateTime: data?.eventInfo?.concentrateTime || '',
    concentrateLocation: data?.eventInfo?.concentrateLocation || ''
  });

  if (!data) return <div className="text-center text-dark-500 py-10">Không có dữ liệu show này</div>;

  const event = data.eventInfo;

  // Xử lý lưu thông tin tập trung
  const handleSaveConcentrate = async () => {
    if (event?.id) {
      await dispatch(updateEventConcentrate({ 
        id: event.id, 
        data: concentrateData 
      })).unwrap();
      
      setIsEditing(false);
      // Load lại để cập nhật UI mới nhất
      dispatch(fetchEventWithMembers(event.id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* --- Section 1: Thông tin cơ bản --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-dark-800/50 p-5 rounded-2xl border border-dark-700 shadow-inner">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500"><Info size={20}/></div>
            <div>
              <p className="text-[10px] text-dark-500 uppercase font-bold tracking-widest">Tên Show</p>
              <h4 className="text-white font-bold leading-tight">{event?.name}</h4>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent-500/10 rounded-lg text-accent-500"><MapPin size={20}/></div>
            <div>
              <p className="text-[10px] text-dark-500 uppercase font-bold tracking-widest">Địa điểm diễn</p>
              <h4 className="text-white text-sm">{event?.location}</h4>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><User size={20}/></div>
            <div>
              <p className="text-[10px] text-dark-500 uppercase font-bold tracking-widest">Khách hàng</p>
              <h4 className="text-white font-bold">{event?.customerName}</h4>
              <p className="text-xs text-dark-400 font-mono italic">{event?.customerPhone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><DollarSign size={20}/></div>
            <div>
              <p className="text-[10px] text-dark-500 uppercase font-bold tracking-widest">Ngân sách</p>
              <h4 className="text-primary-400 font-black text-lg">₫{event?.totalAmount?.toLocaleString()}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 2: Thời gian diễn & THÔNG TIN TẬP TRUNG (Edit mode) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Thời gian diễn (Read-only) */}
        <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
          <h5 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest flex items-center gap-2 mb-3">
            <Clock size={14} className="text-primary-500" /> Thời gian diễn
          </h5>
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">{event?.eventDate}</p>
            <p className="text-xl font-black text-primary-400">
              {event?.startTime?.substring(0, 5)} - {event?.endTime?.substring(0, 5)}
            </p>
          </div>
        </div>

        {/* Thông tin tập trung (In-place Edit) */}
        <div className={`p-4 rounded-xl border transition-all ${isEditing ? 'bg-dark-900 border-primary-500/50 shadow-lg' : 'bg-primary-500/5 border-primary-500/20'}`}>
          <div className="flex justify-between items-center mb-3">
            <h5 className="text-[10px] font-bold text-primary-500 uppercase tracking-widest flex items-center gap-2">
              <Timer size={14} /> Tập trung anh em
            </h5>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-[10px] text-primary-400 hover:text-primary-300 font-bold bg-primary-500/10 px-2 py-1 rounded"
              >
                Cập nhật
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="text-dark-500 hover:text-white transition-colors"><XCircle size={16}/></button>
                <button 
                  disabled={loading}
                  onClick={handleSaveConcentrate} 
                  className="text-green-500 hover:text-green-400 transition-colors"
                >
                  {loading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-2">
              <p className="text-sm font-bold text-white">
                <span className="text-primary-500 mr-2">●</span>{event?.concentrateTime || '--:--'}
              </p>
              <p className="text-xs text-dark-400 italic">
                <span className="text-primary-500 mr-2">●</span>{event?.concentrateLocation || 'Chưa có địa điểm tập kết'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-300">
              <input 
                type="time"
                placeholder="Giờ (VD: 07:30)"
                className="w-full bg-dark-800 border border-dark-700 text-white text-xs rounded-lg p-2 focus:border-primary-500 outline-none"
                value={concentrateData.concentrateTime}
                onChange={(e) => setConcentrateData({...concentrateData, concentrateTime: e.target.value})}
              />
              <input 
                type="text"
                placeholder="Địa điểm tập trung"
                className="w-full bg-dark-800 border border-dark-700 text-white text-xs rounded-lg p-2 focus:border-primary-500 outline-none"
                value={concentrateData.concentrateLocation}
                onChange={(e) => setConcentrateData({...concentrateData, concentrateLocation: e.target.value})}
              />
            </div>
          )}
        </div>
      </div>

      {/* --- Section 3: Danh sách nhân sự --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-tight">
            <Users size={18} className="text-primary-500" />
            Đội Hình ({data.members?.length || 0})
          </h3>
          <button 
            onClick={onAssignClick}
            className="text-[10px] bg-dark-800 hover:bg-primary-600 text-white px-3 py-2 rounded-lg font-bold transition-all border border-dark-700"
          >
            Sửa đội hình
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.members && data.members.length > 0 ? (
            data.members.map((m: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-dark-800/30 border border-dark-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-[10px] font-black text-primary-500 border border-primary-500/20 shadow-inner">
                    {m.positionAbbr || 'L'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{m.fullName}</p>
                    <p className="text-[10px] text-dark-500 uppercase">{m.position}</p>
                  </div>
                </div>
                {m.status === 'ACCEPTED' ? (
                  <CheckCircle2 size={14} className="text-green-500" />
                ) : (
                  <AlertCircle size={14} className="text-yellow-500 animate-pulse" />
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 border border-dashed border-dark-800 rounded-xl text-dark-500 text-[10px] uppercase tracking-widest">
              Show này chưa bắt quân đi diễn
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;