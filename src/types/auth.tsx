export interface LoginRequest{
    username:string;
    password:string;
}

export interface Response{
    id: number;
    username: string;
    email: string;
    roleName: string;
    fullName: string;
    phone: string;
    seniority: number;
    status: string;
    tenantId: number;
    tenantName: string;
    permissions: string[];
}