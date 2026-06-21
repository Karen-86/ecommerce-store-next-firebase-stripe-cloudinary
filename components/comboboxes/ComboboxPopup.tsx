"use client";

import React, { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { ChevronDown, Search } from "lucide-react";
import { InputGroupAddon } from "@/components/ui/input-group";

export type SelectItemPopupType = {
  label: string | number;
  value: string | number;
  code?: string; 
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
};


type ComboboxPopupProps = {
  items: SelectItemPopupType[];
  value: SelectItemPopupType | null; // controlled
  onChange: (item: SelectItemPopupType) => void;

  label?: string;
  placeholder?: string;

  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  labelClassName?: string;

  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";

  successMessage?: string;
  errorMessage?: string;

  allowSearch?: boolean;
};

export function ComboboxPopup({
  items = [],
  value,
  onChange = () => {},

  label = "",
  placeholder = "Select",

  className = "",
  triggerClassName = "",
  contentClassName = "",
  labelClassName = "",

  side = "bottom",
  align = "center",

  successMessage = "",
  errorMessage = "",

  allowSearch = true,
}: ComboboxPopupProps) {
  const id = useId();

  return (
    <div className={`grid items-center gap-1.5 relative  ${className}`}>
      {label && (
        <Label htmlFor={id} className={`w-fit ${labelClassName}`}>
          {label}
        </Label>
      )}
      <Combobox 
        items={items}
        value={value}
        onValueChange={(item) => {
          if (item) onChange(item);
        }}
      >
        <ComboboxTrigger 
          id={id}
          className={`${triggerClassName} font-normal`}
          render={
            <Button variant="outline" className="justify-between min-w-0 cursor-pointer">
              {/* <ComboboxValue placeholder={placeholder} /> */}
              {value?.startIcon && <span className="w-[16px] ">{value.startIcon}</span>}
              <span className="truncate flex-1 text-left">
                {value?.label ? value.label : <span className="text-muted-foreground font-normal">{placeholder}</span>}
              </span>
              {value?.endIcon && <span className="ml-auto w-[16px] ">{value.endIcon}</span>}
              <ChevronDown className="opacity-50" />
            </Button>
          }
        />
        <ComboboxContent 
           
          side={side}
          align={align}
          className={`min-w-[var(--radix-popover-trigger-width)]  ${contentClassName}`}
        >
          {/* {allowSearch && <ComboboxInput showTrigger={false} placeholder={placeholder} />} */}
          {allowSearch && (
            <ComboboxInput onFocus={(e)=>e.stopPropagation()}  placeholder={placeholder} showTrigger={false} showClear className="ring-0! border-0">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </ComboboxInput>
          )}

          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item} className={"cursor-pointer"}>
                {item.startIcon && <span className="w-[16px] ">{item.startIcon}</span>}
                <span className="combobox-demo-text flex-1">{item.label}</span>
                {item.endIcon && <span className="ml-auto w-[16px] ">{item.endIcon}</span>}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {successMessage && <div className="valid-feedback text-green-600 text-xs">{successMessage}</div>}
      {errorMessage && <div className="invalid-feedback text-red-600 text-xs">{errorMessage}</div>}
    </div>
  );
}
