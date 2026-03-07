/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PermissionResponse } from '@/types/permission';
import { permissionService } from '@/services/permissionService';

interface PermissionState {
    permissions: PermissionResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: PermissionState = {
    permissions: [],
    loading: false,
    error: null,
};

export const fetchPermissions = createAsyncThunk(
    'permissions/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await permissionService.getPermissions();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách quyền');
        }
    }
);

const permissionSlice = createSlice({
    name: 'permissions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissions.fulfilled, (state, action: PayloadAction<PermissionResponse[]>) => {
                state.loading = false;
                state.permissions = action.payload;
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default permissionSlice.reducer;