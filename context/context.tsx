"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useProductStore } from "@/modules/products/store";
import { useCartStore } from "@/modules/carts/store";
import { useAuthStore } from "@/modules/auth/store";

type StateType = {
  [key: string]: any;
};

type ContextType = {
  state: StateType;
  setState: (newState: StateType) => void;
  // CMSFetchedData: any;
};

export const Context = createContext<ContextType | null>(null);

export default function Provider({
  children,
  // CMSFetchedData,
}: Readonly<{
  children: React.ReactNode;
  // CMSFetchedData: any;
}>) {
  const [state, setState] = useState<StateType>({});
  const getCartAsync = useCartStore((s) => s.getCartAsync);
  const setCartMode = useCartStore((s) => s.setCartMode);
  const authUser = useAuthStore((s) => s.authUser);

  useEffect(() => {
    // auth still loading
    if (authUser === undefined) return;

    setCartMode();
  }, [authUser, ]);

  return (
    <Context.Provider
      value={{
        state,
        ...state,
        setState,
        // CMSFetchedData
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useGlobalContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useGlobalContext must be used within an Provider");
  }
  return context;
};
