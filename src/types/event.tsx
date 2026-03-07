// 1. Enums (Để dùng trong Filter hoặc Check trạng thái)
export type EventStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type AssignStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CHECKED_IN' | 'CHECKED_OUT';

// 2. Base Interfaces
export interface EventResponse {
    id: number;
    name: string;
    type: string;
    typeDisplayName: string;
    status: EventStatus;
    statusDisplayName: string;
    eventDate: string; // LocalDate -> string (YYYY-MM-DD)
    startTime: string; // LocalTime -> string (HH:mm:ss)
    endTime: string;
    location: string;
    customerName: string;
    customerPhone: string;
    tenantId: number;
    tenantName: string;
    concentrateTime: string | null;
    concentrateLocation: string | null;
    totalAmount: number;
    platformFee: number;
    createdAt: string;
}

export interface EventRequest {
    name: string;
    type: string; // Enum name
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
    customerId?: number | null;
    customerName?: string;
    customerPhone?: string;
    tenantId?: number;
    totalAmount: number;
    description?: string;
    concentrateTime?: string;
    concentrateLocation?: string;
}

// 3. UserEvent & Team (Dành cho Member và Admin quản lý nhân sự)
export interface TeammateDTO {
    fullName: string;
    position: string;
    status: string;
}

export interface UserEventDTO {
    id: number;
    eventId: number;
    eventName: string;
    eventDate: string;
    location: string;
    userId: number;
    fullName: string;
    position: string;
    status: AssignStatus;
    checkinAt: string | null;
    checkoutAt: string | null;
    startTime: string;
    endTime: string;
    concentrateTime: string | null;
    concentrateLocation: string | null;
    note: string | null;
    teammates?: TeammateDTO[]; // Chỉ có khi xem chi tiết lịch cá nhân
}

// 4. Responses Phức hợp
export interface EventWithMembersResponse {
    eventInfo: EventResponse;
    members: UserEventDTO[];
}

export interface MonthlySummary {
    totalEvents: number;
    estimatedRevenue: number;
    completionRate: number;
}

// 5. Requests đặc thù
export interface AssignMemberRequest {
    userId: number;
    position: string;
}

export interface UpdateConcentrateRequest {
    concentrateTime: string;
    concentrateLocation: string;
}

// 6. Pagination Wrapper
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    empty: boolean;
}