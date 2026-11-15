export interface RoleData {
  id: string;
  roleName: string;
  permissions: string[];
}

export interface RoleFormValues {
  roleName: string;
  permissions: string[];
}

export namespace RoleTypes {
  export namespace Service {
    export interface Permission {
      title: string;
      url: string;
      enabled: boolean;
    }

    export interface RoleData {
      id: string;
      name: string;
      permissions: Permission[];
      userCount: number;
      createdAt: string;
    }

    export interface UpdateRoleRequest {
      name: string;
      permissions: Permission[];
    }
  }
}
