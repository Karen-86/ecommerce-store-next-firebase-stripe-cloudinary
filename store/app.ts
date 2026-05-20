import { create } from "zustand";
import type { Cart, CartBaseItem } from "@/modules/carts/types";
import * as cartsApi from "@/modules/carts/api";
import { v4 as uuidv4 } from "uuid";


const noop = () => {};

type AppStore = {
};

export const useAppStore = create<AppStore>((set, get) => ({

}));
