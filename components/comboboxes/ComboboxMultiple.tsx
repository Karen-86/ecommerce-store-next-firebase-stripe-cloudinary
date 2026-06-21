"use client";

import React, { useId } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

export const valueSlugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export type SelectItemMultipleType = {
  label: string;
  value: string;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
};

type ComboboxPopupProps = {
  items: SelectItemMultipleType[];
  value: string[]; // controlled
  onChange: (data: { values: string[]; items: SelectItemMultipleType[] }) => void;

  label?: string;
  placeholder?: string;

  className?: string;
  labelClassName?: string;
  contentClassName?: string;

  allowSearch?: boolean;
  editable?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";

  successMessage?: string;
  errorMessage?: string;
};

export function ComboboxMultiple({
  items = [],
  value,
  onChange = () => {},

  label = "",
  placeholder = "Select",

  className = "",
  labelClassName = "",
  contentClassName = "",

  allowSearch = true,
  editable = false,
  side = "bottom",
  align = "center",

  successMessage = "",
  errorMessage = "",
}: ComboboxPopupProps) {
  const id = useId();
  const anchor = useComboboxAnchor();

  const [inputValue, setInputValue] = React.useState("");

  const slug = valueSlugify(inputValue);
  const itemExists = items.some((i) => i.value === slug);

  // const normalized = inputValue.trim().toLowerCase();
  // const itemExists = items.some((i) => i.value === normalized || i.label.toLowerCase() === normalized);

  const createItem = () => {
    if (!editable) return;
    if (!inputValue.trim()) return;
    if (itemExists) return;

    const newItem: SelectItemMultipleType = {
      label: inputValue.trim(),
      value: slug,
    };

    const updatedItems = [...items, newItem];
    const updatedValues = [...value, newItem.value];

    onChange({
      values: updatedValues,
      items: updatedItems,
    });

    setInputValue("");
  };

  return (
    <div className={`grid items-center gap-1.5 relative  ${className}`}>
      {label && (
        <Label htmlFor={id} className={`w-fit ${labelClassName}`}>
          {label}
        </Label>
      )}
      <Combobox
        multiple
        autoHighlight
        items={items}
        value={value}
        onValueChange={(values) => {
          setInputValue("");

          if (!Array.isArray(values)) return;

          onChange({ values, items });
        }}
      >
        <ComboboxChips ref={anchor} className="w-full combobox-chips min-h-9">
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {/* {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))} */}
                {values.map((value: string) => {
                  const item = items.find((i) => i.value === value);

                  return (
                    <ComboboxChip key={value} className="whitespace-normal">
                      {item?.label}
                    </ComboboxChip>
                  );
                })}

                {allowSearch ? (
                  <ComboboxChipsInput
                    id={id}
                    placeholder={!value.length ? placeholder : ''}
                    className=""
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();

                      createItem();
                    }}
                  />
                ) : (
                  <span className="text-black/50 pointer-events-none">Select</span>
                )}
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxContent anchor={anchor} side={side} align={align} className={`${contentClassName}`}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item.value} className="cursor-pointer">
                {/* {item.label} */}
                {item.startIcon && <span className="w-[16px] ">{item.startIcon}</span>}
                <span className="combobox-demo-text flex-1">{item.label}</span>
                {item.endIcon && <span className="ml-auto w-[16px] ">{item.endIcon}</span>}
              </ComboboxItem>
            )}
          </ComboboxList>
          {!!(editable && inputValue.length && !itemExists) && (
            <div className="p-1 border-t">
              <div
                onClick={createItem}
                className="flex items-center gap-2 py-1 px-2 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
              >
                <PlusCircle className="w-4" />{" "}
                <span className="text-sm font-semibold text-black/80">Add "{inputValue}"</span>
              </div>
            </div>
          )}
        </ComboboxContent>
      </Combobox>

      {successMessage && <div className="valid-feedback text-green-600 text-xs">{successMessage}</div>}
      {errorMessage && <div className="invalid-feedback text-red-600 text-xs">{errorMessage}</div>}
    </div>
  );
}
