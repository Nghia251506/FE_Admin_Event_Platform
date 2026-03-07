// 1. DTO cho Request (Dùng khi làm Form thêm/sửa)
export interface CustomerRequest {
  fullName: string;
  phone: string;
  // Lưu ý: userId có thể optional nếu hệ thống tự gán người login
  userId?: number; 
  email?: string;
  address?: string;
  note?: string;
}

// 2. DTO cho Response (Dùng để hiển thị danh sách/chi tiết)
export interface CustomerResponse {
  id: number;
  fullName: string;
  phone: string;
  assignedToId: number;   // ID của thành viên quản lý
  assignedToName: string; // Tên hiển thị luôn, không cần gọi thêm API lấy User
  email?: string;
  address?: string;
  note?: string;
  type?: string;          // INDIVIDUAL, BUSINESS...
  createdAt?: string;     // ISO Date string từ Backend
}

// 3. Interface cho dữ liệu phân trang (Bắt buộc phải có để làm Pagination)
export interface CustomerPageResponse {
  content: CustomerResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // currentPage (Backend bắt đầu từ 0)
  last: boolean;
  first: boolean;
  empty: boolean;
}