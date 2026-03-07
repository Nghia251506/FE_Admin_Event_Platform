/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventService, EventQueryParams } from '@/services/eventService';
import { EventResponse, MonthlySummary, PageResponse } from '@/types/event';

interface EventState {
    events: EventResponse[];
    pagination: {
        totalElements: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
    summary: MonthlySummary | null;
    loading: boolean;
    error: string | null;
}

const initialState: EventState = {
    events: [],
    pagination: {
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 10
    },
    summary: null,
    loading: false,
    error: null,
};

// Thunk lấy danh sách sự kiện
export const fetchEvents = createAsyncThunk(
    'events/fetchAll',
    async ({ isAdmin, params }: { isAdmin: boolean; params: EventQueryParams }, { rejectWithValue }) => {
        try {
            return await eventService.getEvents(isAdmin, params);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách sự kiện');
        }
    }
);

// Thunk lấy thống kê tháng
export const fetchMonthlySummary = createAsyncThunk(
    'events/fetchSummary',
    async ({ isAdmin, month, year }: { isAdmin: boolean; month: number; year: number }, { rejectWithValue }) => {
        try {
            return await eventService.getMonthlySummary(isAdmin, month, year);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Không thể lấy thống kê');
        }
    }
);

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        // Xóa data khi chuyển trang hoặc logout
        clearEvents: (state) => {
            state.events = [];
            state.summary = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchEvents
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<PageResponse<EventResponse>>) => {
                state.loading = false;
                state.events = action.payload.content;
                state.pagination = {
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.number,
                    pageSize: action.payload.size
                };
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            
            // Handle fetchMonthlySummary
            .addCase(fetchMonthlySummary.fulfilled, (state, action: PayloadAction<MonthlySummary>) => {
                state.summary = action.payload;
            });
    },
});

export const { clearEvents } = eventSlice.actions;
export default eventSlice.reducer;