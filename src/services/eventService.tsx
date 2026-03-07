import axios from "@/lib/axios"
import { 
    EventResponse, 
    MonthlySummary, 
    PageResponse, 
    EventRequest, 
    UserEventDTO, 
    EventWithMembersResponse,
    AssignMemberRequest,
    UpdateConcentrateRequest,
    AssignStatus
} from "@/types/event"

export const eventService = {
    // ==========================================
    // SECTION 1: DÀNH CHO ADMIN ĐỘI LÂN
    // ==========================================

    // Lấy toàn bộ show của đội (có search, filter ngày tháng)
    getAllEvents: async (params: any): Promise<PageResponse<EventResponse>> => {
        const response = await axios.get('/tenant/events/all', { params });
        return response.data;
    },

    // Lấy lịch diễn theo tháng (Dùng cho tab Lịch)
    getMonthlySchedule: async (month: number, year: number, page = 0): Promise<PageResponse<EventResponse>> => {
        const response = await axios.get('/tenant/events', { params: { month, year, page } });
        return response.data;
    },

    // Card thống kê doanh thu, tỷ lệ hoàn thành
    getMonthlySummary: async (month: number, year: number): Promise<MonthlySummary> => {
        const response = await axios.get('/tenant/events/summary', { params: { month, year } });
        return response.data;
    },

    // Chấp nhận hoặc Từ chối show từ sàn
    respondToPlatform: async (eventId: number, action: 'accept' | 'reject') => {
        const response = await axios.post(`/tenant/events/${eventId}/${action}`);
        return response.data;
    },

    // Gán anh em vào vị trí (Đầu lân, Đuôi lân, Trống...)
    assignMembers: async (eventId: number, members: AssignMemberRequest[]) => {
        const response = await axios.post(`/tenant/events/${eventId}/assign`, members);
        return response.data;
    },

    // Cập nhật giờ giấc/địa điểm tập trung
    updateConcentrate: async (eventId: number, data: UpdateConcentrateRequest) => {
        const response = await axios.patch(`/tenant/events/${eventId}/concentrate-info`, data);
        return response.data;
    },

    // Xem chi tiết show + danh sách anh em đã gán
    getEventWithMembers: async (eventId: number): Promise<EventWithMembersResponse> => {
        const response = await axios.get(`/tenant/events/${eventId}/with-members`);
        return response.data;
    },

    // ==========================================
    // SECTION 2: DÀNH CHO ANH EM ĐI DIỄN (MEMBER)
    // ==========================================

    // Lấy lịch đi diễn của riêng tôi (User lấy từ Token bên BE)
    getMyAssignments: async (): Promise<UserEventDTO[]> => {
        const response = await axios.get('/tenant/events/my-assignments');
        return response.data;
    },

    // Đồng ý hoặc Từ chối khi được gán show
    respondToAssignment: async (userEventId: number, status: AssignStatus, note?: string) => {
        const response = await axios.patch(`/tenant/events/assignments/${userEventId}/respond`, null, {
            params: { status, note }
        });
        return response.data;
    },

    // Check-in tập trung
    concentrateCheckIn: async (userEventId: number, location: string) => {
        const response = await axios.post(`/tenant/events/assignments/${userEventId}/concentrate-check-in`, null, {
            params: { location }
        });
        return response.data;
    },

    // Check-in tại điểm diễn (Người đầu tiên check-in sẽ start show)
    checkIn: async (userEventId: number, location: string) => {
        const response = await axios.post(`/tenant/events/assignments/${userEventId}/check-in`, null, {
            params: { location }
        });
        return response.data;
    },

    // Check-out khi diễn xong (Người cuối cùng check-out sẽ close show)
    checkOut: async (userEventId: number) => {
        const response = await axios.post(`/tenant/events/assignments/${userEventId}/check-out`);
        return response.data;
    },
    createEvent: async (eventData: EventRequest) => {
        const response = await axios.post('/public/events', eventData);
        return response.data;
    }
};