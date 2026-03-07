export interface TenantResponse{
    id: number;
    name: string;
    email: string;
    domain: string;
    logo: string;
    statusConfirm: string;
    active: boolean;
    isVerified: boolean;
    createdAt: string; // ISO format
    updatedAt: string; // ISO format
}

export interface TenantSimpleResponse{
    id: number;
    name: string;
}