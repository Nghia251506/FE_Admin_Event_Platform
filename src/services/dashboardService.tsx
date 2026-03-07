import axios from "@/lib/axios";
import { DashboardResponse } from "@/types/dashboard"; // Path tới cái interface anh em mình vừa thống nhất

const DashboardService = {
  /**
   * Lấy dữ liệu tổng quan cho trang Dashboard
   * Bao gồm: Thống kê tháng, Sự kiện sắp tới, Trạng thái đội ngũ
   */
  getSummary: async (): Promise<DashboardResponse> => {
    try {
      const response = await axios.get<DashboardResponse>("/dashboard/summary");
      return response.data;
    } catch (error: any) {
      // Bắn lỗi ra để Slice hoặc Component xử lý Toast thông báo
      throw error.response?.data?.message || "Không thể tải dữ liệu Dashboard";
    }
  },

  /**
   * (Tùy chọn) Nếu sau này ông giáo muốn refresh riêng phần sự kiện
   */
  // getUpcomingEvents: async () => { ... }
};

export default DashboardService;