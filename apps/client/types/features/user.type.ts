export type UserStatus = "Aktif" | "Tidak Aktif";

export interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: UserStatus;
}

export interface UserFormValues {
    name: string;
    email: string;
    phone: string;
    role: string;
    status: UserStatus | "";
}