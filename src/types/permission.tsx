interface PermissionResponse {
    id: number;
    name: string;
    description: string;
    tenantId: number;
    isGlobal: boolean;
}

export type { PermissionResponse }