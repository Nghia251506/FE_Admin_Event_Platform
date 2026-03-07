import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Building2, Phone, Edit, Star, Calendar, Info } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchCustomers, createCustomer, setCurrentPage } from '@/store/slices/customerSlice';
import { CustomModal } from '@/global/modal/CustomModal';
import CustomerForm from '@/components/Customer/CustomerForm';
import CustomerDetail from '@/components/Customer/CustomerDetail'; // Import file vừa tạo
import { CustomerRequest, CustomerResponse } from '@/types/customer';

const Clients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { customers, loading, totalElements, totalPages, currentPage } = useSelector(
    (state: RootState) => state.customers
  );

  // State cho Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State cho Modal Chi tiết
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);

  useEffect(() => {
    dispatch(fetchCustomers({ page: currentPage, size: 5 }));
  }, [dispatch, currentPage]);

  const handleOpenCreate = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, customer: CustomerResponse) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra Card (mở detail)
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (customer: CustomerResponse) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleFormSubmit = async (data: CustomerRequest) => {
    if (selectedCustomer) {
      console.log("Update logic here:", data);
    } else {
      await dispatch(createCustomer(data));
    }
    setIsModalOpen(false);
    dispatch(fetchCustomers({ page: currentPage, size: 5 }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Quản Lý Khách Hàng</h1>
          <p className="text-dark-400">Danh sách khách hàng và lịch sử hợp tác</p>
        </div>
        <button onClick={handleOpenCreate} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>Thêm Khách Hàng</span>
        </button>
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <Briefcase size={24} className="text-primary-500 mb-3" />
          <h3 className="text-2xl font-bold text-white mb-1">{totalElements}</h3>
          <p className="text-sm text-dark-400">Tổng khách hàng</p>
        </div>
        <div className="card bg-gradient-to-br from-primary-900/20 to-transparent">
          <Star size={24} className="text-accent-500 mb-3" />
          <h3 className="text-2xl font-bold text-white mb-1">VIP</h3>
          <p className="text-sm text-dark-400">Hạng khách hàng</p>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-dark-400 space-y-4">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
            <p>Đang tải dữ liệu lân vờn cầu...</p>
          </div>
        ) : (
          customers.map((client) => (
            <div
              key={client.id}
              onClick={() => handleOpenDetail(client)} // Click vào Card là xem chi tiết
              className="card hover:border-primary-600/50 transition-all group cursor-pointer relative"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-dark-800 group-hover:bg-primary-900/20 transition-colors">
                    <Building2 size={28} className="text-dark-200 group-hover:text-primary-400" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                        {client.fullName}
                      </h3>
                      <p className="text-sm text-dark-400 flex items-center gap-1">
                        <Phone size={12} /> {client.phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleOpenEdit(e, client)}
                        className="p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-primary-400 transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dark-800">
                    <div>
                      <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-1">Người phụ trách</p>
                      <p className="text-sm text-white font-medium">{client.assignedToName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-1">Thao tác</p>
                      <span className="text-xs text-primary-500 font-bold flex items-center justify-end gap-1">
                        Xem chi tiết <Info size={12}/>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => dispatch(setCurrentPage(idx))}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                currentPage === idx 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' 
                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* MODAL THÊM / SỬA */}
      <CustomModal.ModalCreateAndEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
        size="md"
        formContent={
          <CustomerForm 
            initialData={selectedCustomer} 
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        }
      />

      {/* MODAL CHI TIẾT (TIÊM MỚI) */}
      <CustomModal.ModalCreateAndEdit
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Thông tin chi tiết khách hàng"
        size="md"
        formContent={
          selectedCustomer ? <CustomerDetail customer={selectedCustomer} /> : null
        }
      />
    </div>
  );
};

export default Clients;