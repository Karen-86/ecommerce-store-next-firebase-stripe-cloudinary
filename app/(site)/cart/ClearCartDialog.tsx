"use client";

import React, { useState, useEffect } from "react";
import { ButtonDemo, DialogDemo, InputDemo } from "@/components/index";
import { useUserStore } from "@/modules/users/store";
import { successAlert, errorAlert, warningAlert } from "@/lib/utils/alert";
import { useCartStore } from "@/modules/carts/store";

export const ClearCartDialog = () => {
  return (
    <DialogDemo
      contentClassName=""
      trigger={
        <ButtonDemo variant="outlineDanger" className="rounded-full w-full sm:w-auto" size="lg" text={`Clear Cart`} />
      }
    >
      {(closeDialog) => <ClearCartDialogContent closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

const ClearCartDialogContent = ({ closeDialog = () => {} }) => {
  const isTargetUserDeleting = useUserStore((s) => s.isTargetUserDeleting);
  const deleteCartAsync = useCartStore((s) => s.deleteCartAsync);
  const isCartDeleting = useCartStore((s) => s.isCartDeleting);

  const clearCart = async () => {
    await deleteCartAsync();
  };

  return (
    <div className="clear-cart-dialog">
      <h2 className="mb-2 text-lg font-semibold!">Clear Cart</h2>
      <p className="mb-6 text-xs text-secondary-v3">
        Are you sure you want to clear your cart? This action cannot be undone and all items will be removed from your
        cart.
      </p>

      <div className="button-group flex justify-end gap-2">
        <ButtonDemo
          className=""
          text="Cancel"
          variant="outline"
          type="button"
          onClick={() => {
            closeDialog();
          }}
          disabled={isTargetUserDeleting}
        />

        <ButtonDemo
          disabled={isCartDeleting}
          variant="destructive"
          text={`Submit`}
          onClick={clearCart}
        />
      </div>
    </div>
  );
};
