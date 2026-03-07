import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fcmService } from "@/services/FcmService";
import { FcmTokenRequest } from "@/types/fcm";

export const registerFcmToken = createAsyncThunk(
    "fcm/register",
    async (data: FcmTokenRequest, { rejectWithValue }) => {
        try {
            return await fcmService.registerToken(data);
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

interface FcmNotificationPayload {
    type: string;           
    eventId?: string;      // Đổi sessionId thành eventId cho đúng LionDance
    message?: string;       
    sound?: string;        // Để nhận file âm thanh từ BE
    [key: string]: any;     
}

interface FcmState {
    token: string | null;
    isRegistered: boolean;
    loading: boolean;
    currentNotification: FcmNotificationPayload | null; // Lưu data từ BE gửi về (sessionId, type...)
    isModalOpen: boolean;
}

const initialState: FcmState = {
    token: null,
    isRegistered: false,
    loading: false,
    currentNotification: null,
    isModalOpen: false,
};

const fcmSlice = createSlice({
    name: "fcm",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        // Action này để Layout gọi khi nhận được onMessage (Foreground)
        receiveNotification: (state, action) => {
            state.currentNotification = action.payload;
            // state.isModalOpen = true; // Bỏ cái này đi nếu không dùng Modal nữa
            // Chúng ta dùng state.currentNotification làm "ngòi nổ" cho Toast
        },
        closeFcmModal: (state) => {
            state.isModalOpen = false;
            state.currentNotification = null;
        },
        resetFcmState: (state) => {
            state.token = null;
            state.isRegistered = false;
            state.isModalOpen = false;
            state.currentNotification = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerFcmToken.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerFcmToken.fulfilled, (state) => {
                state.loading = false;
                state.isRegistered = true;
            })
            .addCase(registerFcmToken.rejected, (state) => {
                state.loading = false;
                state.isRegistered = false;
            });
    },
});

export const { setToken, receiveNotification, closeFcmModal } = fcmSlice.actions;
export default fcmSlice.reducer;