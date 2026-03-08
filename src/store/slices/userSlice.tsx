/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userService } from "@/services/userService";
import {
  UserResponse,
  CreateUser,
  UpdateUser,
  changePassword,
} from "@/types/user";

interface UserState {
  users: UserResponse[];
  totalCount: number;
  currentUser: UserResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  totalCount: 0,
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (
    { page, size, search }: { page: number; size: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      return await userService.getUsers(page, size, search);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy danh sách người dùng",
      );
    }
  },
);

export const fetchUserDetail = createAsyncThunk(
  "users/fetchDetail",
  async (id: number, { rejectWithValue }) => {
    try {
      return await userService.getUserDetail(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy thông tin người dùng",
      );
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (data: CreateUser, { rejectWithValue }) => {
    try {
      return await userService.createUser(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tạo người dùng",
      );
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (
    { id, data }: { id: number; data: UpdateUser },
    { rejectWithValue },
  ) => {
    try {
      return await userService.updateUser(id, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể cập nhật người dùng",
      );
    }
  },
);

export const changeUserPassword = createAsyncThunk(
  "users/changePassword",
  async (
    { id, data }: { id: number; data: changePassword },
    { rejectWithValue },
  ) => {
    try {
      await userService.changePassword(id, data);
      return true;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể đổi mật khẩu",
      );
    }
  },
);

export const assignPermissions = createAsyncThunk(
  "users/assignPermissions",
  async (
    { id, permissionIds }: { id: number; permissionIds: number[] },
    { rejectWithValue },
  ) => {
    try {
      return await userService.assignPermissions(id, permissionIds);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể gán quyền người dùng",
      );
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.currentUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        
        // action.payload bây giờ là { users: [...], total: 5 } từ userService trả về
        if (action.payload) {
          // 1. Gán danh sách user để hiển thị 4 ông đầu tiên
          state.users = action.payload.users || [];
          
          // 2. GÁN CÁI NÀY ĐỂ HIỆN PHÂN TRANG:
          // totalCount từ 0 sẽ nhảy lên 5. 
          state.totalCount = action.payload.total || 0;
        } else {
          state.users = [];
          state.totalCount = 0;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserDetail.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.currentUser = action.payload;
        },
      )
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.users.push(action.payload);
        },
      )
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          const index = state.users.findIndex(
            (user) => user.id === action.payload.id,
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }
          if (state.currentUser && state.currentUser.id === action.payload.id) {
            state.currentUser = action.payload;
          }
        },
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changeUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(assignPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignPermissions.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;
