import { FirestoreDoc } from "@/types";

/* ---------------- BASE DOMAIN ---------------- */

export type UserBase = {
  id?: string;
  bio?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  base64PhotoURL?: string;
  roles?: [string];
  uid?: string;
  addresses?: { [key: string]: any }[];
};

/* ---------------- UI / DOMAIN LAYER ---------------- */

export type User = UserBase & {
  // fullName: string;
};

/* ---------------- API LAYER ---------------- */

export type UserApi = UserBase & FirestoreDoc

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UsersApiResponse = ApiResponse<UserApi[] | any>;
export type UserApiResponse = ApiResponse<UserApi | any>;

