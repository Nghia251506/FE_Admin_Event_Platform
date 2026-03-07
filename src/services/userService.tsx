/* eslint-disable no-useless-catch */
import axios from "@/lib/axios"
import {CreateUser, UpdateUser, changePassword, UserResponse} from "@/types/user"

export const userService = {
    createUser: async (data: CreateUser): Promise<UserResponse> => {
        try {
            const response = await axios.post('/users', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (id: number, data: UpdateUser): Promise<UserResponse> => {
        try {
            const response = await axios.put(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (id: number, data: changePassword): Promise<void> => {
        try {
            await axios.post(`/users/${id}/change-password`, data);
        } catch (error) {
            throw error;
        }
    },

    getUserDetail: async (id: number): Promise<UserResponse> => {
        try {
            const response = await axios.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUsers: async (page: number, size: number, search?: string): Promise<{users: UserResponse[], total: number}> => {
        try {
            const response = await axios.get('/users', { 
                params: { 
                    page: page ? page : 0,
                    size: size ? size : 10,
                    search: search || ''
                } 
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    assignPermissions: async (id: number, permissionIds: number[]): Promise<void> => {
        try {
            await axios.post(`/users/${id}/permissions`,  permissionIds );
        } catch (error) {
            throw error;
        }
    }
}