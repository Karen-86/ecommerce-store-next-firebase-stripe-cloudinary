import React, { useState, useEffect, useMemo } from "react";
import type { CartItemWithCheckbox } from "../types";
import { useCartStore } from "../store";

const useCartItemsWithCheckbox = () => {
  const [cartItemsWithCheckbox, setCartItemsWithCheckbox] = useState<CartItemWithCheckbox[]>([]);

  const cart = useCartStore((s) => s.cart);


  const isAllCartItemsChecked =
    cartItemsWithCheckbox?.length > 0 && cartItemsWithCheckbox.every((item) => item.isSelected);

  const selectedCartItemsWithCheckbox = useMemo(() => {
    return cartItemsWithCheckbox.filter((item) => item.isSelected);
  }, [cartItemsWithCheckbox]);

  useEffect(() => {
    // if (!cart) return;

    setCartItemsWithCheckbox((prev) => {
      if(!cart) return []
      return cart?.items?.map((cartItem) => {
        const existingItem = prev.find((item) => item.id === cartItem.id);

        return {
          ...cartItem,
          isSelected: existingItem ? existingItem.isSelected : true,
        };
      });
    });
  }, [cart]);

  return {
    cartItemsWithCheckbox,
    setCartItemsWithCheckbox,
    isAllCartItemsChecked,
    selectedCartItemsWithCheckbox,
  };
};

export default useCartItemsWithCheckbox;
