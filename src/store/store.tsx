import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import tenantReducer from './slices/tenantSlice';
import userReducer from './slices/userSlice';
import permissionReducer from './slices/permissionSlice';
import customerReducer from "./slices/customerSlice";
import dashboardReducer from "./slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    tenants: tenantReducer,
    users: userReducer,
    permissions: permissionReducer,
    customers: customerReducer,
    dashboard: dashboardReducer
    // sessions: sessionReducer,
    // adminDisputes: adminDisputeReducer,
    // interpretation: interpretationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export Type để dùng cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;