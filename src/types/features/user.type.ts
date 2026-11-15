import { HttpClientTypes } from "@/types/lib/http-client.type";
import { Query } from "@/types/lib/query.type";

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

export declare namespace UserTypes {
  namespace Service {
    interface UserData {
      id: string;
      memberId: string | null;
      dpcId: string | null;
      name: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
      lastLoginAt: Date | null;
    }

    interface CreateUserRequest {
      memberId: string | null;
      dpcId: string | null;
      name: string;
      email: string;
      username: string;
      password: string;
    }

    interface UpdateUserRequest {
      memberId?: string | null;
      dpcId?: string | null;
      name: string;
    }

    type UserPagination =
      | HttpClientTypes.Response<Query.Pagination<UserData>>
      | HttpClientTypes.Response<unknown>;
  }
}
