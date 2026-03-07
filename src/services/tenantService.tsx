/* eslint-disable no-useless-catch */
import axios from "@/lib/axios";
import { TenantResponse, TenantSimpleResponse } from "@/types/tenant";

export const tenantService = {
    // Lấy danh sách tenant (Dành cho Admin sàn)
    getTenants: async (): Promise<TenantResponse[]> => {
        try {
            const response = await axios.get('/tenants');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy thông tin chi tiết 1 tenant (Dành cho Admin sàn)
    getTenantDetail: async (id: number): Promise<TenantResponse> => {
        try {
            const response = await axios.get(`/tenants/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy danh sách tenant đơn giản (Dành cho dropdown khi tạo sự kiện, cả Admin và Tenant đều dùng được)
    getTenantSimpleList: async (): Promise<TenantSimpleResponse[]> => {
        try {
            const response = await axios.get('/tenants/simple');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}