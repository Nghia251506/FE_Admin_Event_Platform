/* eslint-disable no-useless-catch */
import axios from "@/lib/axios"
import { LoginRequest, Response } from "@/types/auth"

export const login = async (data: LoginRequest): Promise<Response> => {
    try {
        const response = await axios.post('/auth/login', data);
        return response.data;
    }  catch (error) {
        throw error;
    }
}

export const logout = async (): Promise<void> => {
    try {
        await axios.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
    } catch (error) {
        throw error;
    }
}
export const Me = async (): Promise<Response> => {
    try {
        const response = await axios.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error;
    }
}