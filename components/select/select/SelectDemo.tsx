"use client";

import React, { ReactElement, useId } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type SelectItemType = {
  label: string | number;
  value: string | number;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
};

type SelectProps = {
  items: SelectItemType[];
  value?: string | number; // controlled
  onChange?: (item: SelectItemType) => void;

  label?: string;
  placeholder?: string;

  className?: string;
  triggerClassName?: string;
  contentClassName?: string;

  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";

  errorMessage?: string;
  successMessage?: string;
};

export function SelectDemo({
  items = [],
  value,
  onChange = () => {},

  label,
  placeholder = "Select",

  className = "",
  triggerClassName = "",
  contentClassName = "",

  side = "bottom",
  align = "start",

  errorMessage = "",
  successMessage = "",
}: SelectProps) {
  const id = useId();

  return (
    <div className={`grid gap-1 ${className}`}>
      {label && (
        <Label htmlFor={id} className="text-xs uppercase tracking-wide font-medium">
          {label}
        </Label>
      )}

      <Select
        value={value?.toString()}
        onValueChange={(val) => {
          const selected = items.find((i) => i.value.toString() === val);
          if (selected) onChange(selected);
        }}
      >
        <SelectTrigger id={id} className={`w-full ${triggerClassName}`}>
            <SelectValue placeholder={placeholder} className="" />
        </SelectTrigger>

        <SelectContent side={side} align={align} className={`max-h-[300px]  ${contentClassName}`}>
          <SelectGroup >
            {/* <SelectLabel>Fruits</SelectLabel> */}
            {items.length ? (
              items.map((item, index) => (
                <SelectItem key={`${item.value}-${index}`} value={item.value.toString()} className="flex cursor-pointer">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.startIcon && <span className="w-4   ">{item.startIcon}</span>}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.endIcon && <span className="ml-auto w-4 ">{item.endIcon}</span>}
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>
                Empty
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {successMessage && <div className="text-green-600 text-xs">{successMessage}</div>}
      {errorMessage && <div className="text-red-600 text-xs">{errorMessage}</div>}
    </div>
  );
}
