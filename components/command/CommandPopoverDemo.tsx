

"use client";

import React, { ReactElement, useState, useEffect } from "react";
import { CreditCard, Settings, User, Laptop, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ButtonDemo } from "@/components/index.js";
import { v4 as uuidv4 } from "uuid";

type ItemsProps = {
  label: string;
  value: string;
  isSelected?: boolean;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
};

type ComboboxDemoProps = {
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  label?: string;
  placeholder?: string;
  defaultItems: ItemsProps[];
  successMessage?: string;
  errorMessage?: string;
  allowSearch?: boolean;
  callback?: (item: ItemsProps) => void;
};

export function CommandPopoverDemo({
  className = "",
  triggerClassName = "",
  contentClassName = "",
  label = "",
  placeholder = "Select",
  side = "bottom",
  align = "center",
  defaultItems = [],
  successMessage = "",
  errorMessage = "",
  allowSearch = true,
  callback = () => {},
}: ComboboxDemoProps) {
  const [items, setItems] = useState<ItemsProps[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemsProps | null>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [id, setId] = useState("");

  useEffect(() => setId(uuidv4()), []);

  useEffect(() => {
    setItems([...defaultItems]);
    const selectedItem = [...defaultItems].find((item: ItemsProps) => item?.isSelected);
    if (selectedItem) {
      setValue(selectedItem?.value);
      setSelectedItem(selectedItem);
    }
  }, [defaultItems]);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  const { setTheme } = useTheme();

  return (
    <div className={`field grid items-center gap-1.5 relative  ${className}`}>
      {label && (
        <Label htmlFor={id} className="w-fit">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          asChild
          className={`combobox-demo-trigger w-full min-w-[0] cursor-pointer hover:bg-transparent ${triggerClassName}`}
        >
          <ButtonDemo
            className={`text-slate-500 flex w-full justify-between ${triggerClassName}`}
            text={
              <>
                Search...
                {/* <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                       <span className="text-xs">⌘</span>J
                     </kbd> */}
              </>
            }
            variant="outline"
            endIcon={<Search />}
            onClick={() => setOpen(true)}
          />
        </PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          // className={` p-0 combobox-demo-content w-full min-w-[350px] max-w-[350px] ${contentClassName}`}
          className={` p-0 combobox-demo-content w-[var(--radix-popover-trigger-width)] ${contentClassName}`}
        >
          <Command>
            {allowSearch && <CommandInput placeholder="Search..." />}
            <CommandList className={`${className}`}>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {items.map((item, index) => {
                  if (index > 3) return;
                  return (
                    <CommandItem
                      className=" cursor-pointer"
                      key={index}
                      onSelect={() => {
                        setSelectedItem(item);
                        callback(item);
                        setOpen(false);
                      }}
                    >
                      {item.startIcon && <span className="w-[16px] ">{item.startIcon}</span>}
                      <span className="command-demo-text flex-1">{item.label}</span>
                      {item.endIcon && <span className="ml-auto w-[16px] ">{item.endIcon}</span>}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem className="cursor-pointer">
                  <User />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem className="cursor-pointer">
                  <CreditCard />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem className="cursor-pointer">
                  <Settings />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />
              <CommandGroup heading="Theme">
                <CommandItem className="cursor-pointer" onSelect={() => runCommand(() => setTheme("light"))}>
                  <Sun />
                  Light
                </CommandItem>
                <CommandItem className="cursor-pointer" onSelect={() => runCommand(() => setTheme("dark"))}>
                  <Moon />
                  Dark
                </CommandItem>
                <CommandItem className="cursor-pointer" onSelect={() => runCommand(() => setTheme("system"))}>
                  <Laptop />
                  System
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {successMessage && <div className="valid-feedback text-green-600 text-xs">{successMessage}</div>}
      {errorMessage && <div className="invalid-feedback text-red-600 text-xs">{errorMessage}</div>}
    </div>
  );
}
