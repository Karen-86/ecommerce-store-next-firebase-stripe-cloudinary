"use client";

import React, { useState, useEffect } from "react";
import {
  ControlledSheetDemo,
  ProductCard,
  ButtonDemo,
  CartItemCard,
  InputDemo,
  ComboboxDemo,
} from "@/components/index";
import { useProductStore } from "@/modules/products/store";
import { useCartStore } from "@/modules/carts/store";
import Link from "next/link";
import { redirect } from "next/navigation";
import * as cartsApi from "@/modules/carts/api";
import { alert, successAlert, errorAlert, warningAlert } from "@/lib/utils/alert";
import LOCAL_DATA from "@/constants/localData";
import { v4 as uuidv4 } from "uuid";
import { MapPin } from "lucide-react";
import { COUNTRIES } from "@/constants";
import { useUserStore } from "@/modules/users/store";
import { useAuthStore } from "@/modules/auth/store";
import { ValidationResult } from "joi";
import { createUserAddressSchema } from "@/app/api/v1/users/users.validator";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { validateCreateTargetUserAddress } from "@/modules/users/validation";

const { preloader } = LOCAL_DATA.images;

const AddressFormSheet = ({ isOpen, setIsOpen, editingItem = null, setEditingItem=()=>{} }: any) => {
  const initialAddress = {
    country: "",
    state: "",
    city: "",
    streetAddress: "",
    postalCode: "",
  };

  const [address, setAddress] = useState(initialAddress);

  useEffect(() => {
    if (!editingItem) return;
    setAddress({
      country: editingItem.country,
      state: editingItem.state,
      city: editingItem.city,
      streetAddress: editingItem.streetAddress,
      postalCode: editingItem.postalCode,
    });
  }, [editingItem]);

  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [result, setResult] = useState<ValidationResult>();
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const user = useAuthStore((s) => s.user);
  const createTargetUserAddressAsync = useUserStore((s) => s.createTargetUserAddressAsync);
  const updateTargetUserAddressAsync = useUserStore((s) => s.updateTargetUserAddressAsync);
  const isTargetUserAddressCreating = useUserStore((s) => s.isTargetUserAddressCreating);
  const isTargetUserAddressUpdating = useUserStore((s) => s.isTargetUserAddressUpdating);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = validateCreateTargetUserAddress(address);
    if (!error) {
      if (editingItem) {
        updateTargetUserAddressAsync({
          userId: user.id,
          addressId: editingItem.id,
          body: address,
          successCB: (message: string) => {
            alert(message);
            setIsOpen(false);
          },
        });
      } else {
        createTargetUserAddressAsync({
          userId: user.id,
          body: address,
          successCB: (message: string) => {
            alert(message);
            setIsOpen(false);
          },
        });
      }
      console.log("Submit");
    }
    if (!error) return;
    setWasSubmitted(true);
  };

  useEffect(() => setResult(validateCreateTargetUserAddress(address)), [address]);

  useEffect(() => {
    if (!wasSubmitted) return;
    const errors: Record<string, string> = {};
    result?.error?.details.forEach((item) => {
      const key = String(item.path[0]);
      if (errors[key]) return;
      errors[key] = item.message;
    });
    setErrorMessages(errors);
  }, [result, wasSubmitted]);

  useEffect(() => {
    if (!isOpen) {
      setAddress(initialAddress);
      setWasSubmitted(false);
      setErrorMessages({});
      setEditingItem(null)
    }
  }, [isOpen]);

  return (
    <ControlledSheetDemo
      title={
        <div className="flex items-center">
          <MapPin className="text-black/60 h-4" />
          {editingItem ? "Edit Address" : "Add New Address"}
        </div>
      }
      description="Fill in your delivery address details"
      side="right"
      contentClassName=" overflow-y-auto "
      trigger=" "
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {(onClose) => (
        <form onSubmit={onSubmit} className={` h-full flex flex-col ${wasSubmitted ? "was-submitted" : ""}`}>
          <div className="flex-1 py-10 px-5">
            <ComboboxDemo
              items={COUNTRIES}
              value={address.country}
              label="Country*"
              placeholder="Select country..."
              onChange={(item) => {
                setAddress((prev) => ({
                  ...prev,
                  country: item.value.toString(),
                }));
              }}
              className="max-w-[350px] mb-5"
              labelClassName="text-xs"
              triggerClassName={`custom-trigger`}
              contentClassName={`custom-content`}
              errorMessage={errorMessages.country}
            />

            <InputDemo
              label="State/Province (Optional)"
              name="state"
              placeholder="e.g., California, Texas, Florida"
              type="text"
              onChange={onChange}
              className="mb-5"
              labelClassName="text-xs"
              value={address.state}
              errorMessage={errorMessages.state}
              inputClassName={errorMessages.state ? "is-invalid" : "is-valid"}
            />
            <InputDemo
              label="City*"
              name="city"
              placeholder="e.g., Toronto, Los Angeles, Tokyo"
              type="text"
              onChange={onChange}
              className="mb-5"
              labelClassName="text-xs"
              value={address.city}
              errorMessage={errorMessages.city}
              inputClassName={errorMessages.city ? "is-invalid" : "is-valid"}
            />
            <InputDemo
              label="Street Address*"
              name="streetAddress"
              placeholder="e.g., 123 Main St, Apt 3E"
              type="text"
              onChange={onChange}
              className="mb-5"
              labelClassName="text-xs"
              value={address.streetAddress}
              errorMessage={errorMessages.streetAddress}
              inputClassName={errorMessages.streetAddress ? "is-invalid" : "is-valid"}
            />
            <InputDemo
              label="Postal Code*"
              name="postalCode"
              placeholder="e.g., 10001 or SW1A 1AA"
              type="text"
              onChange={onChange}
              className="mb-5"
              labelClassName="text-xs"
              value={address.postalCode}
              errorMessage={errorMessages.postalCode}
              inputClassName={errorMessages.postalCode ? "is-invalid" : "is-valid"}
            />
          </div>
          <div className="btn-group  gap-2 px-5 py-5">
            <ButtonDemo
              onClick={(e) => {
                e.preventDefault()
                onClose();
              }}
              className="w-full rounded-lg mb-3"
              variant="outline"
              text={`Cancel`}
            />
            <ButtonDemo
              className="w-full rounded-lg  hover:bg-black/80"
              variant="dark"
              startIcon={false ? <img src={preloader} className=" w-[18px] h-[18px]" /> : null}
              text={`${editingItem ? "Edit Address": 'Save Address'}`}
              disabled={isTargetUserAddressCreating || isTargetUserAddressUpdating}
            />
          </div>
        </form>
      )}
    </ControlledSheetDemo>
  );
};

export default AddressFormSheet;
