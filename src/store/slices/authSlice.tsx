/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, logout, Me } from '../../services/authService';
import { LoginRequest, Response } from '../../types/auth';

interface AuthState {
  user: Response | null;
  currentUser: Response | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean; // Thêm cờ này để PrivateRoute biết đã check xong chưa
}

// Hàm helper để lấy data an toàn
const getStoredUser = (): Response | null => {
  const stored = localStorage.getItem('currentUser');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};
const savedUser = localStorage.getItem('currentUser');
const initialState: AuthState = {
  user: getStoredUser(),
  currentUser: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,
  isInitialized: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await login(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Me();
      return response;
    } catch (error: any) {
      // Nếu Me lỗi (hết hạn token), xóa luôn storage
      localStorage.removeItem('currentUser');
      return rejectWithValue(error.response?.data || 'Fetch user failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Thêm action này để manual clear nếu cần
    clearAuth: (state) => {
      state.user = null;
      localStorage.removeItem('currentUser');
    }
  },
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<Response>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        localStorage.removeItem('currentUser');
      })

      /* FETCH ME (Refresh trang) */
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<Response>) => {
        state.loading = false;
        state.user = action.payload;
        state.isInitialized = true;
        // Cập nhật lại storage vì có thể role hoặc thông tin đã thay đổi ở DB
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isInitialized = true;
        state.error = action.payload as string;
        localStorage.removeItem('currentUser');
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;