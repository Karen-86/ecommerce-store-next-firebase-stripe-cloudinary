"use client";

import React, { useState, useEffect, ReactElement } from "react";
import { Search } from "lucide-react";

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
import { ButtonDemo } from "../button/ButtonDemo";
import type { SearchProduct } from "@/modules/products/types";

type CommandDemoProps = {
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  placeholder?: string;
  defaultItems: SearchProduct[];
  callback?: (item: SearchProduct) => void;
};

export function CommandDialogDemo({
  className = "",
  triggerClassName = "",
  contentClassName = "",
  placeholder = "Type a command or search...",
  defaultItems = [],
  callback = () => {},
}: CommandDemoProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SearchProduct[]>([]);
  const [, setSelectedItem] = useState<SearchProduct | null>(null);

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

  useEffect(() => {
    setItems([...defaultItems]);
    const selectedItem = [...defaultItems].find((item: SearchProduct) => item?.isSelected);
    if (selectedItem) setSelectedItem(selectedItem);
  }, [defaultItems]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <div className="flex flex-col gap-4 ">
      <ButtonDemo
        onClick={() => setOpen(true)}
        className="rounded-full bg-transparent! shadow-none text-gray-600 hover:text-gray-800 relative [&>svg]:w-5! [&>svg]:h-5!"
        size="icon"
        icon={<Search />}
      ></ButtonDemo>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="w-full min-w-none max-w-185! h-[calc(100vh-160px)] top-[80px]"
      >
        <Command className="p-0 ">
          <CommandInput placeholder="Type a command or search..." className="h-12! " />
          <CommandList className=" max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading={`Search Results(${items.length})`} className="p-0 rounded-none">
              {items.map((item, index) => {
                // if (index > 3) return;
                return (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      setSelectedItem(item);
                      callback(item);
                      setOpen(false);
                    }}
                    className="p-5 hover:bg-primary/4 hover:text-primary hover:[&>.start-icon]:border-primary duration-200 in-data-[slot=dialog-content]:rounded-none! cursor-pointer"
                  >
                    <span className="w-15 h-15 bg-white start-icon border duration-200 rounded-md p-1.5">
                      {item.startIcon}
                    </span>
                    <div className="flex-1  min-w-0">
                      <div className="command-demo-text mb-1 truncate ">{item.label}</div>
                      <div className="command-demo-text mb-1 truncate text-xs text-gray-600 ">{item.description}</div>
                      <div className="command-demo-text text-primary font-medium">{item.price}</div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
