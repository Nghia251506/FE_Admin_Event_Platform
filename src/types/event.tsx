export interface EventResponse {
    id: number;
    name: string;
    eventDate: string; // ISO format
    location: string;
    description: string;
    startTime: string; // ISO format
    endTime: string; // ISO format
    tenantName: string;
    totalAmount: number;
    customerName: string;
    customerPhone:string;
    tenantId: number;
    status: string;
    type:string;
    typeDisplayName:string;
    statusDisplayName:string;
    createdAt: string; // ISO format
    updatedAt: string; // ISO format
}

export interface MonthlySummary{
    totalEvents: number;
    estimatedRevenue: number;
    completionRate: number; // Tỷ lệ hoàn thành sự kiện
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // page hiện tại
    empty: boolean;
}

export interface EventRequest{
    name: string;
    eventDate: string; // ISO format
    location: string;
    description: string;
    startTime: string; // ISO format
    endTime: string; // ISO format
    customerName: string;
    customerPhone:string;
    type:string;
    totalAmount: number;
}