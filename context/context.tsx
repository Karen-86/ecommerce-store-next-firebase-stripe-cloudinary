"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useProductStore } from "@/modules/products/store";

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
  const getProductsAsync = useProductStore((s) => s.getProductsAsync);
  
  useEffect(() => {
    getProductsAsync();
  }, []);

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
