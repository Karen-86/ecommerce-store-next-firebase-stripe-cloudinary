import { create } from "zustand";
import type { User as FirebaseAuthUser } from "firebase/auth";
import type { UserApi, UserApiResponse } from "@/modules/users/types";
import * as authApi from "@/modules/auth/api";

const noop = () => {};

type AuthStore = {
  authUser: FirebaseAuthUser | null | undefined;
  user: UserApi;
  isUserLoading: boolean;
  isAuthUserLoading: boolean;
  setIsAuthUserLoading: (v: boolean) => void;
  setIsUserLoading: (v: boolean) => void;
  setAuthUser: (v: any) => void;
  getProfileAsync: (params?: any) => Promise<UserApiResponse>;
  reset: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: undefined, // firebase returns null or User. undefined means loading
  user: {},
  isUserLoading: false,
  isAuthUserLoading: false,

  setIsAuthUserLoading: (v) => set({ isAuthUserLoading: v }),
  setIsUserLoading: (v) => set({ isUserLoading: v }),
  setAuthUser: (v) => set({ authUser: v }),

  getProfileAsync: async ({ successCB = noop, errorCB = noop } = {}) => {
    set({ isUserLoading: true });

    try {
      const data = await authApi.getProfile();

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data.data, " =getProfileAsync=");
      set({ user: data.data });

      // mediaData.data && useBannerStore.getState().setBanner(mediaData.data)

      successCB(data);
      return data;
    } finally {
      set({ isUserLoading: false });
    }
  },

  reset: () => {
    set({
      authUser: undefined,
      user: {},
      isUserLoading: false,
      isAuthUserLoading: false,
    });
  },
}));
