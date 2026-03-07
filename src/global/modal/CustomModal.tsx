import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

// --- Khung vỏ dùng chung cho toàn bộ dự án ---
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const BaseModal: React.FC<BaseModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      {/* Modal Box */}
      <div className={`relative bg-dark-900 border border-dark-800 w-full ${sizeClasses[size]} rounded-2xl shadow-2xl animate-scale-in overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-800">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-800 rounded-full transition-colors text-dark-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[85vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Các hàm Modal sẽ export ---

interface CreateAndEditProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  formContent: ReactNode; // Truyền bất kỳ Form nào vào đây (Form Sự kiện, Form Thành viên, v.v.)
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const ModalCreateAndEdit = ({ isOpen, onClose, title, formContent, size }: CreateAndEditProps) => (
  <BaseModal isOpen={isOpen} onClose={onClose} title={title} size={size}>
    {formContent}
  </BaseModal>
);

interface ConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  type?: 'danger' | 'warning';
}

const ModalConfirm = ({ isOpen, onClose, title = "Xác nhận", message, onConfirm, confirmLabel = "Đồng ý", type = 'danger' }: ConfirmProps) => (
  <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="space-y-6">
      <p className="text-dark-300 text-center">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">Hủy</button>
        <button 
          onClick={() => { onConfirm(); onClose(); }} 
          className={`flex-1 py-2 rounded-lg font-bold text-white transition-colors ${
            type === 'danger' ? 'bg-red-600 hover:bg-red-500' : 'bg-primary-600 hover:bg-primary-500'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </BaseModal>
);

// --- Export Object ---
export const CustomModal = {
  ModalCreateAndEdit,
  ModalConfirm,
};