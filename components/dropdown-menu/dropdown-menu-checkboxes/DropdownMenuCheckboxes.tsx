"use client";

import React, { ReactNode, ReactElement, useState, useEffect } from "react";
// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DropdownItem = {
  name?: string;
  isChecked: boolean;
  disabled?: boolean;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  id: string;
};

type DropdownMenuCheckboxesProps = DropdownMenuContentProps & {
  items: DropdownItem[];
  onCheckedChange: (value: { isChecked: boolean; checkboxId: string }) => void;
  trigger?: ReactNode;
  buttonName?: string;
  title?: string;
  triggerClassName?: string;
  contentClassName?: string;
  checkboxItemClassName?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children?: ReactNode;
  open?: boolean;
setOpen?: (open: boolean) => void;
};

export function DropdownMenuCheckboxes({
  items = [],
  onCheckedChange = () => {},
  trigger = null,
  buttonName = "Open",
  title = "",
  contentClassName = "",
  triggerClassName = "",
  checkboxItemClassName = '',
  variant = "outline",
  children = null,
  open = false,
  setOpen = ()=>{},
  ...props
}: DropdownMenuCheckboxesProps) {
 

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);
  };

  return (
    <DropdownMenu  open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild className={`dropdown-menu-checkboxes-trigger ${triggerClassName}`}>
        {trigger || (
          <Button variant={variant} size="sm">
            {buttonName}
            <ChevronDown />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`mx-3 dropdown-menu-checkboxes-content  p-0 w-80 ${contentClassName}`}
        {...props}
      >
        {title && <DropdownMenuLabel>{title}</DropdownMenuLabel>}
        {/* <DropdownMenuSeparator /> */}
        {items.length
          ? items.map((item, index) => {
              return (
                <DropdownMenuCheckboxItem
                  // onSelect={(e) => e.preventDefault()}
                  key={`${item.id}-${index}`}
                  checked={item.isChecked}
                  onCheckedChange={(isChecked) => onCheckedChange({ isChecked, checkboxId: item.id })}
                  disabled={item.disabled}
                  className={`dropdown-menu-checkbox-item flex items-center gap-2 rounded-none cursor-pointer py-2 px-3  ${checkboxItemClassName} ${item.isChecked ? "":' **:text-black/60!'}  `}
                >
                  {item.startIcon && <span className="">{item.startIcon}</span>}
                  <span className="line-clamp-2 max-w-[85%]">{item.name}</span>
                  {item.endIcon && <span className="ml-auto">{item.endIcon}</span>}
                </DropdownMenuCheckboxItem>
              );
            })
          : ""}
        {children}
        {!items.length && !children && <div className="text-slate-400 text-sm px-2">Empty</div>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
