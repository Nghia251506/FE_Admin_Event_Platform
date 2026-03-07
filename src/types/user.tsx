interface CreateUser{
    username: string;
    password: string;
    email: string;
    fullName: string;
    phone: string;
    seniority: number;
    roleId: number;
}

interface UpdateUser{
    email: string;
    fullName: string;
    phone: string;
    seniority: number;
    roleId: number;
    status: string;
    isActive: boolean;
    permissionIds: number[];
}

interface changePassword{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface UserResponse{
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    seniority: number;
    roleName: string;
    status: string;
    tenantId: number;
    tenantName: string;
    permissions: string[];
    isActive: boolean;
    isVerified: boolean;
}

export type {CreateUser, UpdateUser, changePassword, UserResponse}