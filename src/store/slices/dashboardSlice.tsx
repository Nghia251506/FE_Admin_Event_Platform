import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import DashboardService from "@/services/DashboardService";
import { DashboardResponse } from "@/types/dashboard";

// 1. Định nghĩa trạng thái của Dashboard
interface DashboardState {
  data: DashboardResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null; // Lưu lại thời điểm cập nhật cuối cùng
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// 2. Thunk - Lấy toàn bộ dữ liệu Dashboard (Stats, Events, Team)
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await DashboardService.getSummary();
    } catch (error: any) {
      return rejectWithValue(
        error || "Không thể tải dữ liệu Dashboard. Vui lòng thử lại!"
      );
    }
  }
);

// 3. Slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Nếu ông giáo muốn reset data khi logout hoặc chuyển đội
    clearDashboardData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý khi bắt đầu gọi API
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Khi lấy dữ liệu thành công
      .addCase(fetchDashboardSummary.fulfilled, (state, action: PayloadAction<DashboardResponse>) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      // Khi gặp lỗi (ví dụ: mất mạng, hết hạn Token)
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;