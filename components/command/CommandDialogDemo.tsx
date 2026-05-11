

"use client";

import React, { useState, useEffect, ReactElement, useId } from "react";
// import { type DialogProps } from "@radix-ui/react-dialog";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { ButtonDemo } from "@/components/index";
import { Search, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { SearchProduct } from "@/modules/products/types";

type CommandDemoProps = {
  items: SearchProduct[];
  onSelect?: (item: SearchProduct) => void;

  label?: string;
  placeholder?: string;

  className?: string;
  triggerClassName?: string;
  contentClassName?: string;

  allowSearch?: boolean;
  isLoading?: boolean;

  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export function CommandDialogDemo({
  items = [],
  onSelect = () => {},

  label = "",
  placeholder = "Search...",

  className = "",
  triggerClassName = "",
  contentClassName = "",

  allowSearch = true,
  isLoading = false,

  searchQuery,
  setSearchQuery,
}: CommandDemoProps) {
  const [open, setOpen] = useState(false);

  const id = useId();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className={`field grid items-center gap-1.5 relative ${className}`}>
      {label && (
        <Label htmlFor={id} className="w-fit">
          {label}
        </Label>
      )}
      <ButtonDemo
        onClick={() => setOpen(true)}
        className="rounded-full bg-transparent! shadow-none text-gray-600 hover:text-gray-800 relative [&>svg]:w-5! [&>svg]:h-5!"
        size="icon"
        icon={<Search />}
      ></ButtonDemo>

      <CommandDialog open={open} onOpenChange={setOpen} className="w-full max-w-185! top-[80px]  h-[70vh]">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command shouldFilter={false} className="p-0">
          {allowSearch && (
            <CommandInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Type a command or search..."
              className=""
            />
          )}
          <CommandList className={`${contentClassName} max-h-none `}>
            {/* <CommandEmpty>No results found.</CommandEmpty> */}
            <CommandGroup
              heading={
                isLoading
                  ? ""
                  : searchQuery === ""
                    ? "Featured Products"
                    : `Search Results (${items.length})`
              }
              className="p-0!"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-medium">Searching...</span>
                </div>
              ) : (
                items.map((item, index) => {
                  return (
                    <CommandItem
                      key={`${item.value}-${index}`}
                      value={item.value}
                      onSelect={(val) => {
                        const selected = items.find((i) => i.value.toString() === val);

                        if (selected) onSelect(selected);

                        setOpen(false);
                      }}
                      className="p-5 hover:bg-primary/4 hover:text-primary hover:[&>.start-icon]:border-primary duration-200 in-data-[slot=dialog-content]:rounded-none! cursor-pointer"
                    >
                      <span className="w-15 h-15 bg-white start-icon border duration-200 rounded-md p-1.5">
                        {item.startIcon}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="command-demo-text mb-1 truncate">{item.label}</div>

                        <div className="command-demo-text mb-1 truncate text-xs text-gray-600">{item.description}</div>

                        <div className="command-demo-text text-primary font-medium">{item.price}</div>
                      </div>
                    </CommandItem>
                  );
                })
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
