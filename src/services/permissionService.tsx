/* eslint-disable no-useless-catch */
import axios from "@/lib/axios"
import {PermissionResponse} from "@/types/permission"
export const permissionService = {
    getPermissions: async (): Promise<PermissionResponse[]> => {
        try {
            const response = await axios.get('/permissions');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}