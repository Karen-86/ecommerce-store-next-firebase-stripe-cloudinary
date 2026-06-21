"use client";

import React, { ReactElement, useState, useEffect, useId } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export type SelectItemType = {
  label: string | number;
  value: string | number;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
};

type ComboboxDemoProps = {
  items: SelectItemType[];
  value?: string | number; // controlled
  onChange?: (item: SelectItemType) => void;

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

export function ComboboxDemo({
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
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const id = useId();

  const item = items.find((item) => item.value === value);

  return (
    <div className={`field grid items-center gap-1.5 relative  ${className}`}>
      {label && (
        <Label htmlFor={id} className={`w-fit ${labelClassName}`}>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          asChild
          className={`combobox-demo-trigger w-full min-w-[0] cursor-pointer hover:bg-transparent ${triggerClassName}`}
        >
          <Button variant="outline" role="combobox" aria-expanded={open} className="font-normal justify-between">
            {item?.startIcon && <span className="w-[16px] ">{item.startIcon}</span>}
            <span className="truncate flex-1 text-left">
              {item ? item.label : <span className="text-muted-foreground">{placeholder}</span>}
            </span>
            {item?.endIcon && <span className="ml-auto w-[16px] ">{item.endIcon}</span>}
            <ChevronDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          className={` p-0 combobox-demo-content w-[var(--radix-popover-trigger-width)] ${contentClassName}`}
        >
          <Command>
            {allowSearch && <CommandInput placeholder="Search..." />}
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item: SelectItemType, index: number) => (
                  <CommandItem
                    className=" cursor-pointer"
                    key={`${item.value}-${index}`}
                    value={item.label?.toString()}
                    onSelect={(val) => {
                      // const selected = items.find((i) => `${i.label} ${i.value}`.toLowerCase() === val.toLowerCase());
                      // if (selected) onChange(selected);
                      onChange(item)
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("ml-auto", value?.toString() === item.value?.toString() ? "opacity-100" : "opacity-0")} />
                    {item.startIcon && <span className="w-[16px] ">{item.startIcon}</span>}
                    <span className="combobox-demo-text flex-1">{item.label}</span>
                    {item.endIcon && <span className="ml-auto w-[16px] ">{item.endIcon}</span>}
                  </CommandItem>
                ))}
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

// delete after some time

// "use client";

// import React, { ReactElement, useState, useEffect, useId } from "react";
// import { Check, ChevronDown } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Label } from "@/components/ui/label";
// import { v4 as uuidv4 } from "uuid";

// type ItemsProps = {
//   label: string;
//   value: string;
//   isSelected?: boolean;
//   startIcon?: ReactElement;
//   endIcon?: ReactElement;
// };

// type ComboboxDemoProps = {
//   className?: string;
//   triggerClassName?: string;
//   contentClassName?: string;
//   side?: "top" | "right" | "bottom" | "left";
//   align?: "start" | "center" | "end";
//   label?: string;
//   placeholder?: string;
//   defaultItems: ItemsProps[];
//   successMessage?: string;
//   errorMessage?: string;
//   allowSearch?: boolean;
//   callback?: (item: object) => void;
// };

// export function ComboboxDemo({
//   className = "",
//   triggerClassName = "",
//   contentClassName = "",
//   label = "",
//   placeholder = "Select",
//   side = "bottom",
//   align = "center",
//   defaultItems = [],
//   successMessage = "",
//   errorMessage = "",
//   allowSearch = true,
//   callback = () => {},
// }: ComboboxDemoProps) {
//   const [items, setItems] = useState<ItemsProps[]>([]);
//   const [selectedItem, setSelectedItem] = useState<ItemsProps | null>(null);
//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState("");
//   const id = useId()

//   useEffect(() => {
//     setItems([...defaultItems]);
//     const selectedItem = [...defaultItems].find((item: ItemsProps) => item?.isSelected);
//     if (selectedItem) {
//       setValue(selectedItem?.value);
//       setSelectedItem(selectedItem);
//     }
//   }, [defaultItems]);

//   return (
//     <div className={`field grid items-center gap-1.5 relative  ${className}`}>
//       {label && (
//         <Label htmlFor={id} className="w-fit">
//           {label}
//         </Label>
//       )}
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger
//           id={id}
//           asChild
//           className={`combobox-demo-trigger w-full min-w-[0] cursor-pointer hover:bg-transparent ${triggerClassName}`}
//         >
//           <Button variant="outline" role="combobox" aria-expanded={open} className=" justify-between">
//             {selectedItem?.startIcon && <span className="w-[16px] ">{selectedItem.startIcon}</span>}
//             <span className="truncate flex-1 text-left">
//               {value ? items.find((item) => item.value === value)?.label : <span className="text-muted-foreground" >{placeholder}</span> }
//             </span>
//             {selectedItem?.endIcon && <span className="ml-auto w-[16px] ">{selectedItem.endIcon}</span>}
//             <ChevronDown className="opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent
//           side={side}
//           align={align}
//           // className={` p-0 combobox-demo-content w-full min-w-[350px] max-w-[350px] ${contentClassName}`}
//           className={` p-0 combobox-demo-content w-[var(--radix-popover-trigger-width)] ${contentClassName}`}
//         >
//           <Command>
//             {allowSearch && <CommandInput placeholder="Search..." />}
//             <CommandList>
//               <CommandEmpty>No framework found.</CommandEmpty>
//               <CommandGroup>
//                 {items.map((item) => (
//                   <CommandItem
//                     className=" cursor-pointer"
//                     key={item.value}
//                     value={item.value}
//                     onSelect={(currentValue) => {
//                       setValue(currentValue === value ? "" : currentValue);
//                       setSelectedItem(item);
//                       callback(item);
//                       setOpen(false);
//                     }}
//                   >
//                     <Check className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")} />
//                     {item.startIcon && <span className="w-[16px] ">{item.startIcon}</span>}
//                     <span className="combobox-demo-text flex-1">{item.label}</span>
//                     {item.endIcon && <span className="ml-auto w-[16px] ">{item.endIcon}</span>}
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//       {successMessage && <div className="valid-feedback text-green-600 text-xs">{successMessage}</div>}
//       {errorMessage && <div className="invalid-feedback text-red-600 text-xs">{errorMessage}</div>}
//     </div>
//   );
// }
