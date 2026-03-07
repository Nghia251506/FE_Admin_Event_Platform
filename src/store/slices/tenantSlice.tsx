/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tenantService } from '@/services/tenantService';
import { TenantResponse, TenantSimpleResponse } from '@/types/tenant';

interface TenantState {
    tenants: TenantResponse[];
    tenantSimpleList: TenantSimpleResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: TenantState = {
    tenants: [],
    tenantSimpleList: [],
    loading: false,
    error: null,
};

// Thunk lấy danh sách tenant (Dành cho Admin sàn)
export const fetchTenants = createAsyncThunk(
    'tenants/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await tenantService.getTenants();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách tenant');
        }
    }
);

// Thunk lấy danh sách tenant đơn giản (Dành cho dropdown khi tạo sự kiện)
export const fetchTenantSimpleList = createAsyncThunk(
    'tenants/fetchSimpleList',
    async (_, { rejectWithValue }) => {
        try {
            return await tenantService.getTenantSimpleList();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách tenant đơn giản');
        }
    }
);

const tenantSlice = createSlice({
    name: 'tenants',
    initialState,
    reducers: {
        // Xóa data khi chuyển trang hoặc logout
        clearTenants: (state) => {
            state.tenants = [];
            state.tenantSimpleList = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTenants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTenants.fulfilled, (state, action: PayloadAction<TenantResponse[]>) => {
                state.loading = false;
                state.tenants = action.payload;
            })
            .addCase(fetchTenants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTenantSimpleList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTenantSimpleList.fulfilled, (state, action: PayloadAction<TenantSimpleResponse[]>) => {
                state.loading = false;
                state.tenantSimpleList = action.payload;
            })
            .addCase(fetchTenantSimpleList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearTenants } = tenantSlice.actions;

export default tenantSlice.reducer;