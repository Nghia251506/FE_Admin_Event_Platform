import axios from "@/lib/axios";
import { 
  CustomerRequest, 
  CustomerResponse, 
  CustomerPageResponse 
} from "@/types/customer"; // Điều chỉnh path cho đúng nhé ông giáo

const CustomerService = {
  /**
   * Lấy danh sách khách hàng và tìm kiếm (có phân trang)
   * @param keyword Từ khóa tìm kiếm (Tên hoặc SĐT)
   * @param page Trang hiện tại (Bắt đầu từ 0)
   * @param size Số lượng bản ghi trên 1 trang
   */
  getCustomers: async (keyword?: string, page: number = 0, size: number = 10): Promise<CustomerPageResponse> => {
    const response = await axios.get<CustomerPageResponse>("/customers", {
      params: {
        keyword,
        page,
        size,
        sort: "id,desc", // Sắp xếp mới nhất lên đầu cho máu
      },
    });
    return response.data;
  },

  /**
   * Lấy chi tiết khách hàng theo ID
   */
  getCustomerById: async (id: number): Promise<CustomerResponse> => {
    const response = await axios.get<CustomerResponse>(`/customers/${id}`);
    return response.data;
  },

  /**
   * Tạo mới khách hàng
   * Hệ thống BE sẽ tự động gán assignedTo là người đang login
   */
  createCustomer: async (data: CustomerRequest): Promise<CustomerResponse> => {
    const response = await axios.post<CustomerResponse>("/customers", data);
    return response.data;
  },

  /**
   * Cập nhật thông tin khách hàng
   */
  updateCustomer: async (id: number, data: CustomerRequest): Promise<CustomerResponse> => {
    const response = await axios.put<CustomerResponse>(`/customers/${id}`, data);
    return response.data;
  },

  /**
   * Xóa khách hàng
   */
  deleteCustomer: async (id: number): Promise<void> => {
    await axios.delete(`/customers/${id}`);
  },
};

export default CustomerService;