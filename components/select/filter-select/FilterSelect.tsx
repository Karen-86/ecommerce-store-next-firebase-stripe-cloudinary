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
  hasDefaultValue?: boolean;
  onChange?: (item: SelectItemType) => void;
  onClear?: () => void;

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

export function FilterSelect({
  items = [],
  value,
  hasDefaultValue = false,
  onChange = () => {},
  onClear = () => {},

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
    <div className={`grid gap-2 ${className}`}>
      <div className="flex gap-2 justify-between items center">
        <Label htmlFor={id} className="text-xs uppercase tracking-wide font-medium w-fit text-secondary-v2">
          {label}
        </Label>
        {!hasDefaultValue && (
          <div
            className="text-[10px] text-primary/80 hover:text-primary cursor-pointer font-semibold uppercase"
            onClick={onClear}
          >
            Clear
          </div>
        )}
      </div>

      <Select
        value={value?.toString()}
        onValueChange={(val) => {
          const selected = items.find((i) => i.value.toString() === val);
          if (selected) onChange(selected);
        }}
      >
        <SelectTrigger id={id} className={`w-full cursor-pointer ${triggerClassName}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent side={side} align={align} className={`max-h-[300px] ${contentClassName}`}>
          <SelectGroup>
            {/* <SelectLabel>Fruits</SelectLabel> */}
            {items.length ? (
              items.map((item, index) => (
                <SelectItem
                  key={`${item.value}-${index}`}
                  value={item.value.toString()}
                  className="flex cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    {item.startIcon && <span className="w-4">{item.startIcon}</span>}
                    <span className="truncate">{item.label}</span>
                    {item.endIcon && <span className="ml-auto w-4">{item.endIcon}</span>}
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
