import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import CustomerService from "@/services/customerService";
import { 
  CustomerResponse, 
  CustomerPageResponse, 
  CustomerRequest 
} from "@/types/customer";

// 1. Định nghĩa trạng thái của Slice
interface CustomerState {
  customers: CustomerResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  currentCustomer: CustomerResponse | null;
}

const initialState: CustomerState = {
  customers: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
  currentCustomer: null,
};

// 2. Thunks - Xử lý API bất đồng bộ
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (
    { keyword, page, size }: { keyword?: string; page: number; size: number },
    { rejectWithValue }
  ) => {
    try {
      return await CustomerService.getCustomers(keyword, page, size);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy danh sách khách hàng"
      );
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customers/create",
  async (data: CustomerRequest, { rejectWithValue }) => {
    try {
      return await CustomerService.createCustomer(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo khách hàng"
      );
    }
  }
);

// 3. Slice
const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<CustomerPageResponse>) => {
        state.loading = false;
        state.customers = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Customer
      .addCase(createCustomer.fulfilled, (state) => {
        state.loading = false;
        // Sau khi tạo xong thường mình sẽ gọi lại fetch ở Component để đồng bộ data
      });
  },
});

export const { clearCurrentCustomer, setCurrentPage } = customerSlice.actions;
export default customerSlice.reducer;