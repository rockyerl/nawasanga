export interface MockUser {
    id:          string;
    memberId:    string | null;
    dpcId:       string | null;
    name:        string;
    email:       string;
    role:        string;
    createdAt:   string;
    updatedAt:   string;
    lastLoginAt: string | null;
}

export interface MockRole {
    id:         string;
    roleName:   string;
    permission: string;
}

export const mockRoles: MockRole[] = [
    { id: "role_01", roleName: "Super Admin",    permission: "all"             },
    { id: "role_02", roleName: "Admin",          permission: "manage"          },
    { id: "role_03", roleName: "Operator",       permission: "read_write"      },
    { id: "role_04", roleName: "Viewer",         permission: "read_only"       },
    { id: "role_05", roleName: "Finance",        permission: "finance_access"  },
];

export const mockUsers: MockUser[] = [
    {
        id:          "U001",
        memberId:    "MBR-001",
        dpcId:       null,
        name:        "Ahmad Fauzi",
        email:       "ahmad.fauzi@example.com",
        role:        "Super Admin",
        createdAt:   "2024-01-10T08:00:00Z",
        updatedAt:   "2025-03-01T10:00:00Z",
        lastLoginAt: "2026-04-28T09:15:00Z",
    },
    {
        id:          "U002",
        memberId:    "MBR-002",
        dpcId:       null,
        name:        "Siti Rahayu",
        email:       "siti.rahayu@example.com",
        role:        "Admin",
        createdAt:   "2024-02-14T08:00:00Z",
        updatedAt:   "2025-02-20T11:00:00Z",
        lastLoginAt: "2026-04-27T14:30:00Z",
    },
    {
        id:          "U003",
        memberId:    null,
        dpcId:       "DPC-001",
        name:        "Budi Santoso",
        email:       "budi.santoso@example.com",
        role:        "Operator",
        createdAt:   "2024-03-05T08:00:00Z",
        updatedAt:   "2024-12-10T09:00:00Z",
        lastLoginAt: "2026-04-25T08:00:00Z",
    },
    {
        id:          "U004",
        memberId:    "MBR-004",
        dpcId:       null,
        name:        "Dewi Kusuma",
        email:       "dewi.kusuma@example.com",
        role:        "Viewer",
        createdAt:   "2024-04-01T08:00:00Z",
        updatedAt:   "2024-11-15T10:30:00Z",
        lastLoginAt: "2026-04-20T16:45:00Z",
    },
    {
        id:          "U005",
        memberId:    null,
        dpcId:       "DPC-002",
        name:        "Rizky Pratama",
        email:       "rizky.pratama@example.com",
        role:        "Finance",
        createdAt:   "2024-05-20T08:00:00Z",
        updatedAt:   "2025-01-05T13:00:00Z",
        lastLoginAt: "2026-04-29T11:00:00Z",
    },
    {
        id:          "U006",
        memberId:    "MBR-006",
        dpcId:       null,
        name:        "Nurul Hidayah",
        email:       "nurul.hidayah@example.com",
        role:        "Operator",
        createdAt:   "2024-06-10T08:00:00Z",
        updatedAt:   "2025-03-10T08:00:00Z",
        lastLoginAt: null,
    },
    {
        id:          "U007",
        memberId:    null,
        dpcId:       "DPC-003",
        name:        "Hendra Wijaya",
        email:       "hendra.wijaya@example.com",
        role:        "Admin",
        createdAt:   "2024-07-22T08:00:00Z",
        updatedAt:   "2025-04-01T09:00:00Z",
        lastLoginAt: "2026-04-15T07:30:00Z",
    },
    {
        id:          "U008",
        memberId:    "MBR-008",
        dpcId:       null,
        name:        "Eka Putri",
        email:       "eka.putri@example.com",
        role:        "Viewer",
        createdAt:   "2024-08-03T08:00:00Z",
        updatedAt:   "2024-10-20T14:00:00Z",
        lastLoginAt: "2026-03-30T10:15:00Z",
    },
];
export type UserData = MockUser;
export type RoleData = MockRole;