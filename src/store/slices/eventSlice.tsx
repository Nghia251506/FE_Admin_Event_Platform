/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventService } from '@/services/eventService';
import { 
    EventRequest, 
    EventResponse, 
    MonthlySummary, 
    PageResponse, 
    UserEventDTO, 
    EventWithMembersResponse,
    AssignStatus,
    AssignMemberRequest,
    UpdateConcentrateRequest
} from '@/types/event';

interface EventState {
    events: EventResponse[];           // Danh sách show (dùng chung cho All hoặc Month)
    myAssignments: UserEventDTO[];     // Lịch riêng của Member
    currentEventWithMembers: EventWithMembersResponse | null; 
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
    myAssignments: [],
    currentEventWithMembers: null,
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

// ==========================================
// --- THUNKS CHO ADMIN (QUẢN LÝ ĐỘI) ---
// ==========================================

// 1. Lấy lịch diễn theo THÁNG (Cho màn hình Schedule)
export const fetchMonthlySchedule = createAsyncThunk(
    'events/fetchMonthly',
    async ({ month, year, page }: { month: number; year: number; page?: number }, { rejectWithValue }) => {
        try {
            return await eventService.getMonthlySchedule(month, year, page);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Lỗi lấy lịch tháng');
        }
    }
);

// 2. Lấy thống kê THÁNG (Tổng show, doanh thu...)
export const fetchMonthlySummary = createAsyncThunk(
    'events/fetchSummary',
    async ({ month, year }: { month: number; year: number }, { rejectWithValue }) => {
        try {
            return await eventService.getMonthlySummary(month, year);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Lỗi lấy thống kê');
        }
    }
);

// 3. Lấy TẤT CẢ show (Có search, filter nâng cao)
export const fetchAllMyEvents = createAsyncThunk(
    'events/fetchAll',
    async (params: any, { rejectWithValue }) => {
        try {
            return await eventService.getAllEvents(params);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Lỗi lấy danh sách show');
        }
    }
);

// 4. Tạo show mới
export const addEvent = createAsyncThunk(
    'events/addEvent',
    async (eventData: EventRequest, { rejectWithValue }) => {
        try {
            return await eventService.createEvent(eventData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Không thể tạo sự kiện');
        }
    }
);

// 5. Gán nhân sự vào show
export const assignMembersToEvent = createAsyncThunk(
    'events/assignMembers',
    async ({ id, members }: { id: number; members: AssignMemberRequest[] }, { rejectWithValue, dispatch }) => {
        try {
            const response = await eventService.assignMembers(id, members);
            dispatch(fetchEventWithMembers(id)); // Load lại chi tiết sau khi gán
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Lỗi gán nhân sự');
        }
    }
);

// 6. Cập nhật thông tin tập trung (Giờ/Địa điểm)
export const updateEventConcentrate = createAsyncThunk(
    'events/updateConcentrate',
    async ({ id, data }: { id: number; data: UpdateConcentrateRequest }, { rejectWithValue }) => {
        try {
            return await eventService.updateConcentrate(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Lỗi cập nhật thông tin tập trung');
        }
    }
);

// 7. Chi tiết show + danh sách anh em
export const fetchEventWithMembers = createAsyncThunk(
    'events/fetchWithMembers',
    async (id: number, { rejectWithValue }) => {
        try {
            return await eventService.getEventWithMembers(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Lỗi lấy chi tiết nhân sự');
        }
    }
);

// ==========================================
// --- THUNKS CHO MEMBER (ANH EM ĐI DIỄN) ---
// ==========================================

export const fetchMyAssignments = createAsyncThunk(
    'events/fetchMyAssignments',
    async (_, { rejectWithValue }) => {
        try {
            return await eventService.getMyAssignments();
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Lỗi lấy lịch diễn cá nhân');
        }
    }
);

export const respondAssignment = createAsyncThunk(
    'events/respondAssignment',
    async ({ id, status, note }: { id: number, status: AssignStatus, note?: string }, { rejectWithValue, dispatch }) => {
        try {
            await eventService.respondToAssignment(id, status, note);
            dispatch(fetchMyAssignments());
            return { id, status };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Lỗi phản hồi');
        }
    }
);

// ==========================================
// --- SLICE CONFIG ---
// ==========================================

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        clearEvents: (state) => {
            state.events = [];
            state.myAssignments = [];
            state.summary = null;
            state.currentEventWithMembers = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Loading chung cho các hàm fetch danh sách
            .addCase(fetchAllMyEvents.pending, (state) => { state.loading = true; })
            .addCase(fetchMonthlySchedule.pending, (state) => { state.loading = true; })
            
            // Lấy danh sách (All hoặc Month dùng chung state.events)
            .addCase(fetchAllMyEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.content;
                state.pagination = {
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.number,
                    pageSize: action.payload.size
                };
            })
            .addCase(fetchMonthlySchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.content;
                state.pagination = {
                    totalElements: action.payload.totalElements,
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.number,
                    pageSize: action.payload.size
                };
            })

            // Thống kê tháng
            .addCase(fetchMonthlySummary.fulfilled, (state, action: PayloadAction<MonthlySummary>) => {
                state.summary = action.payload;
            })
            
            // Lịch cá nhân Member
            .addCase(fetchMyAssignments.fulfilled, (state, action) => {
                state.myAssignments = action.payload;
                state.loading = false;
            })

            // Chi tiết show kèm list anh em
            .addCase(fetchEventWithMembers.fulfilled, (state, action) => {
                state.currentEventWithMembers = action.payload;
            })

            // Thêm show mới (đưa lên đầu danh sách hiển thị)
            .addCase(addEvent.fulfilled, (state, action) => {
                state.events = [action.payload, ...state.events];
                state.pagination.totalElements += 1;
            })

            // Cập nhật thông tin tập trung (Cập nhật trực tiếp vào list nếu đang hiển thị)
            .addCase(updateEventConcentrate.fulfilled, (state, action) => {
                const index = state.events.findIndex(e => e.id === action.payload.id);
                if (index !== -1) state.events[index] = action.payload;
                if (state.currentEventWithMembers?.eventInfo === action.payload.id) {
                    state.currentEventWithMembers = { ...state.currentEventWithMembers, ...action.payload };
                }
            })

            // Matcher xử lý lỗi cho tất cả các Thunks
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload?.message || action.payload || 'Có lỗi xảy ra';
                }
            );
    },
});

export const { clearEvents } = eventSlice.actions;
export default eventSlice.reducer;