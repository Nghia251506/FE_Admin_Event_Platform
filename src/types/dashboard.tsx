// 1. DTO cho trạng thái thành viên (Team Status)
export interface MemberStatusDTO {
  fullName: string;
  roleName: string;
  status: 'active' | 'busy' | string; // Dùng Union type cho nó "chặt"
  avatar?: string;
}

// 2. DTO cho sự kiện sắp tới (Upcoming Events)
export interface UpcomingEventDTO {
  id: number;
  name: string;
  clientName: string;
  startTime: string; // ISO Date string từ Backend (LocalDateTime)
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled' | string;
  price: number;     // BigDecimal map về number ở FE
}

// 3. Response tổng hợp cho trang Dashboard
export interface DashboardResponse {
  // Bộ 4 con số thống kê ở trên cùng
  monthlyEvents: number;
  activeMemberRatio: string; // Ví dụ: "8/10"
  monthlyRevenue: number;
  averageRating: number;

  // Danh sách sự kiện sắp tới
  upcomingEvents: UpcomingEventDTO[];

  // Trạng thái đội ngũ
  teamStatus: MemberStatusDTO[];
}