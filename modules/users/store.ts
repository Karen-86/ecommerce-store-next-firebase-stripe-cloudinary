import { create } from "zustand";
import type { UserResponse } from "@/modules/users/types";
import { useAuthStore } from "@/modules/auth/store";
import * as usersApi from "@/modules/users/api";

const noop = () => {};

type UserStore = {
  users: UserResponse[];
  targetUser: UserResponse;
  isTargetUserLoading: boolean;
  isUsersLoading: boolean;
  isTargetUserUpdating: boolean;
  isTargetUserRolesUpdating: boolean;
  isTargetUserAddressCreating: boolean;
  isTargetUserAddressUpdating: boolean;
  isTargetUserAddressDeleting: boolean;
  isTargetUserDeleting: boolean;
  getUsersAsync: (params?: any) => Promise<void>;
  getTargetUserAsync: (params?: any) => Promise<void>;
  updateTargetUserAsync: (params?: any) => Promise<void>;
  updateTargetUserRolesAsync: (params?: any) => Promise<void>;
  createTargetUserAddressAsync: (params?: any) => Promise<void>;
  updateTargetUserAddressAsync: (params?: any) => Promise<void>;
  deleteTargetUserAddressAsync: (params?: any) => Promise<void>;
  deleteTargetUserAsync: (params?: any) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  targetUser: {},
  isTargetUserLoading: false,
  isUsersLoading: false,
  isTargetUserUpdating: false,
  isTargetUserRolesUpdating: false,
  isTargetUserAddressCreating: false,
  isTargetUserAddressUpdating: false,
  isTargetUserAddressDeleting: false,
  isTargetUserDeleting: false,

  getUsersAsync: async ({ successCB = noop, errorCB = noop } = {}) => {
    set({ isUsersLoading: true });

    try {
      const data = await usersApi.getUsers();

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =getUsersAsync=");

      set({ users: data.data.users });
      successCB(data);
      return data
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getTargetUserAsync: async ({ userId = "", successCB = noop, errorCB = noop }) => {
    set({ isTargetUserLoading: true });

    try {
      const targetUser = await usersApi.getTargetUser({ userId: userId });

      if (!targetUser.success) {
        errorCB(targetUser);
        return targetUser;
      }
      console.log(targetUser, " =getTargetUserAsync=");

      set({ targetUser: targetUser.data });
      successCB(targetUser);
      return targetUser
    } finally {
      set({ isTargetUserLoading: false });
    }
  },

  updateTargetUserAsync: async ({ userId = "", body = {}, successCB = noop, errorCB = noop }) => {
    set({ isTargetUserUpdating: true });

    try {
      const data = await usersApi.updateTargetUser({ userId: userId, body: body });

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =updateTargetUserAsync=");

      await get().getUsersAsync();
      successCB({ ...data, message: data.message || "User has been updated successfully." });
    } finally {
      set({ isTargetUserUpdating: false });
    }
  },

  updateTargetUserRolesAsync: async ({
    userId = "",
    body = {},
    successCB = noop,
    errorCB = noop,
    warningCB = noop,
  }) => {
    set({ isTargetUserRolesUpdating: true });

    try {
      const data = await usersApi.updateTargetUserRoles({ userId: userId, body: body });

      if (!data.success && data.message === "Field roles is required") {
        warningCB({ ...data, message: "No changes was made." });
        return data;
      }
      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =updateTargetUserRolesAsync=");

      await get().getUsersAsync();
      successCB({ ...data, message: data.message || "User roles has been updated successfully." });
    } finally {
      set({ isTargetUserRolesUpdating: false });
    }
  },

  createTargetUserAddressAsync: async ({ userId = "", body = {}, successCB = noop, errorCB = noop }) => {
    set({ isTargetUserAddressCreating: true });

    try {
      const data = await usersApi.createTargetUserAddress({ userId: userId, body: body });

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =createTargetUserAddressAsync=");

      await useAuthStore.getState().getProfileAsync();
      successCB({ ...data, message: "Address added." });
    } finally {
      set({ isTargetUserAddressCreating: false });
    }
  },

  updateTargetUserAddressAsync: async ({
    userId = "",
    addressId = "",
    query = "",
    body = {},
    successCB = noop,
    errorCB = noop,
  }) => {
    set({ isTargetUserAddressUpdating: true });

    try {
      const data = await usersApi.updateTargetUserAddress({ userId, addressId, body, query });

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =updateTargetUserAddressAsync=");

      await useAuthStore.getState().getProfileAsync();

      successCB({ ...data, message: "Address updated." });
    } finally {
      set({ isTargetUserAddressUpdating: false });
    }
  },
  deleteTargetUserAddressAsync: async ({
    userId = "",
    addressId = "",
    body = {},
    successCB = noop,
    errorCB = noop,
  }) => {
    set({ isTargetUserAddressDeleting: true });

    try {
      const data = await usersApi.deleteTargetUserAddress({ userId, addressId, body });

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =deleteTargetUserAddressAsync=");

      await useAuthStore.getState().getProfileAsync();

      successCB({ ...data, message: "Address deleted." });
    } finally {
      set({ isTargetUserAddressDeleting: false });
    }
  },

  deleteTargetUserAsync: async ({ userId = "", successCB = noop, errorCB = noop }) => {
    set({ isTargetUserDeleting: true });
    try {
      const user = useAuthStore.getState().user;

      const data = await usersApi.deleteTargetUser({ userId: userId });

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =deleteTargetUserAsync=");

      if (userId === user.id) {
        successCB({ ...data, message: "Account deleted successfully" });
        // setTimeout(() => handleSignOut(), 3000)
      } else {
        await get().getUsersAsync();
        successCB({ ...data, message: data.message || "User has been deleted successfully." });
      }
    } finally {
      set({ isTargetUserDeleting: false });
    }
  },
}));
