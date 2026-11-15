export interface RoleData {
    id: string;
    roleName: string;
    permissions: string[];
}

export interface RoleFormValues {
    roleName: string;
    permissions: string[];
}