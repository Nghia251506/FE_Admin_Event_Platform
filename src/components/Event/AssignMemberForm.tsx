/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Users, Trash2, PlusCircle, Save, UserCheck } from 'lucide-react';
import { AssignMemberRequest } from '@/types/event';

interface AssignMemberFormProps {
  eventId: number;
  membersList: any[]; // Danh sách toàn bộ anh em trong đội để chọn
  currentMembers?: any[]; // Những người đã gán từ trước
  onSubmit: (data: AssignMemberRequest[]) => void;
  loading: boolean;
}

const POSITIONS = [
  { value: 'Đầu', label: 'Đầu' },
  { value: 'Đuôi', label: 'Đuôi' },
  { value: 'Đánh Trống', label: 'Đánh Trống' },
  { value: 'Chã', label: 'Chã' },
  { value: 'Tóng', label: 'Tóng' },
  { value: 'Địa', label: 'Địa' },
  { value: 'Thần Tài', label: 'Thần Tài' },
  { value: 'Hậu Cần', label: 'Hậu Cần' },
];

const AssignMemberForm: React.FC<AssignMemberFormProps> = ({ membersList, currentMembers, onSubmit, loading }) => {
  const [assignments, setAssignments] = useState<AssignMemberRequest[]>(
    currentMembers?.map(m => ({ userId: m.userId, position: m.position })) || []
  );

  const addRow = () => {
    setAssignments([...assignments, { userId: 0, position: 'Đầu' }]);
  };

  const removeRow = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: string, value: any) => {
    const newArr = [...assignments];
    (newArr[index] as any)[field] = field === 'userId' ? Number(value) : value;
    setAssignments(newArr);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const validData = assignments.filter(a => a.userId !== 0);
    onSubmit(validData);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
        {assignments.map((item, index) => (
          <div key={index} className="flex gap-3 items-end bg-dark-800/50 p-3 rounded-xl border border-dark-700 animate-slide-in">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold text-dark-500 uppercase ml-1">Anh em</label>
              <select 
                value={item.userId} 
                onChange={(e) => updateRow(index, 'userId', e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 text-white text-sm rounded-lg p-2.5 focus:border-primary-500 outline-none"
              >
                <option value={0}>-- Chọn người --</option>
                {membersList.map(u => (
                  <option key={u.id} value={u.id}>{u.fullName} ({u.phone})</option>
                ))}
              </select>
            </div>

            <div className="w-[140px] space-y-1.5">
              <label className="text-[10px] font-bold text-dark-500 uppercase ml-1">Vị trí</label>
              <select 
                value={item.position} 
                onChange={(e) => updateRow(index, 'position', e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 text-white text-sm rounded-lg p-2.5 focus:border-primary-500 outline-none"
              >
                {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <button 
              type="button" 
              onClick={() => removeRow(index)}
              className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {assignments.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-dark-800 rounded-2xl">
            <UserCheck size={40} className="mx-auto text-dark-800 mb-2" />
            <p className="text-dark-500 text-sm">Chưa có ai đi show này</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-dark-800">
        <button 
          type="button" 
          onClick={addRow}
          className="w-full py-2.5 border border-dashed border-primary-500/30 text-primary-500 hover:bg-primary-500/5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all"
        >
          <PlusCircle size={18} />
          Thêm người đi diễn
        </button>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? <Save className="animate-spin" size={20}/> : <Save size={20} />}
          Xác nhận gán đội hình
        </button>
      </div>
    </form>
  );
};

export default AssignMemberForm;