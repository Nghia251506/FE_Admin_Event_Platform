/* eslint-disable no-useless-catch */
import axios from "@/lib/axios"
import { EventResponse, MonthlySummary, PageResponse } from "@/types/event"

// Định nghĩa params để FE truyền vào linh hoạt
export interface EventQueryParams {
    month?: number;
    year?: number;
    page?: number;
    size?: number;
    search?: string;
    status?: string;
}

/**
 * Xác định tiền tố API dựa trên vai trò
 * Nếu isAdmin = true -> /platform
 * Nếu isAdmin = false -> /tenant
 */
const getBaseUrl = (isAdmin: boolean) => isAdmin ? '/tenant/events' : '/platform/events' ;

export const eventService = {
    // Lấy danh sách sự kiện (Hỗ trợ cả Admin và Tenant)
    getEvents: async (isAdmin: boolean, params: EventQueryParams): Promise<PageResponse<EventResponse>> => {
        try {
            const response = await axios.get(getBaseUrl(isAdmin), { 
                params: {
                    ...params,
                    // Spring Data Page index bắt đầu từ 0, nên nếu FE truyền 1 thì cần -1
                    page: params.page ? params.page : 0 
                } 
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy thống kê (Chủ yếu cho Tenant xem ở Dashboard/Lịch diễn)
    getMonthlySummary: async (isAdmin: boolean, month: number, year: number): Promise<MonthlySummary> => {
        try {
            const url = `${getBaseUrl(isAdmin)}/summary`;
            const response = await axios.get(url, { params: { month, year } });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xem chi tiết 1 sự kiện
    getEventDetail: async (isAdmin: boolean, id: number): Promise<EventResponse> => {
        try {
            const response = await axios.get(`${getBaseUrl(isAdmin)}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}