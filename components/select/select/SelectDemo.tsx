// "use client";

// import React, { ReactElement, useId } from "react";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";

// export type SelectItemType = {
//   label: string | number;
//   value: string | number;
//   startIcon?: ReactElement;
//   endIcon?: ReactElement;
// };

// type SelectProps = {
//   items: SelectItemType[];
//   value?: string | number; // controlled
//   onChange?: (item: SelectItemType) => void;

//   label?: string;
//   placeholder?: string;

//   className?: string;
//   triggerClassName?: string;
//   contentClassName?: string;

//   side?: "top" | "right" | "bottom" | "left";
//   align?: "start" | "center" | "end";

//   errorMessage?: string;
//   successMessage?: string;
// };

// export function SelectDemo({
//   items = [],
//   value,
//   onChange = () => {},

//   label,
//   placeholder = "Select",

//   className = "",
//   triggerClassName = "",
//   contentClassName = "",

//   side = "bottom",
//   align = "start",

//   errorMessage = "",
//   successMessage = "",
// }: SelectProps) {
//   const id = useId();

//   return (
//     <div className={`grid gap-1 ${className}`}>
//       {label && (
//         <Label htmlFor={id} className="text-xs uppercase tracking-wide font-medium">
//           {label}
//         </Label>
//       )}

//       <Select
//         value={value?.toString()}
//         onValueChange={(val) => {
//           const selected = items.find((i) => i.value.toString() === val);
//           if (selected) onChange(selected);
//         }}
//       >
//         <SelectTrigger id={id} className={`w-full ${triggerClassName}`}>
//             <SelectValue placeholder={placeholder} className="" />
//         </SelectTrigger>

//         <SelectContent side={side} align={align} className={`max-h-[300px]  ${contentClassName}`}>
//           <SelectGroup >
//             {/* <SelectLabel>Fruits</SelectLabel> */}
//             {items.length ? (
//               items.map((item, index) => (
//                 <SelectItem key={`${item.value}-${index}`} value={item.value.toString()} className="flex cursor-pointer">
//                   <div className="flex items-center gap-2 min-w-0">
//                     {item.startIcon && <span className="w-4   ">{item.startIcon}</span>}
//                     <span className="flex-1 truncate">{item.label}</span>
//                     {item.endIcon && <span className="ml-auto w-4 ">{item.endIcon}</span>}
//                   </div>
//                 </SelectItem>
//               ))
//             ) : (
//               <SelectItem value="empty" disabled>
//                 Empty
//               </SelectItem>
//             )}
//           </SelectGroup>
//         </SelectContent>
//       </Select>

//       {successMessage && <div className="text-green-600 text-xs">{successMessage}</div>}
//       {errorMessage && <div className="text-red-600 text-xs">{errorMessage}</div>}
//     </div>
//   );
// }


"use client";

import React, { ReactElement, useId } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const outlineButtonStyle =
  "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50";

export type SelectItemType = {
  label: string | number;
  value: string | number;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
};

type SelectProps = {
  items: SelectItemType[];
  value: string; // controlled
  onChange: (item: SelectItemType) => void;

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

  const selectedItem = items.find((i) => i.value.toString() === value);

  return (
    <div className={`grid gap-1 ${className}`}>
      {label && (
        <Label htmlFor={id} className="text-xs uppercase tracking-wide font-medium">
          {label}
        </Label>
      )}

      <Select
        value={value}
        onValueChange={(val) => {
          const selected = items.find((i) => i.value.toString() === val);
          if (selected) onChange(selected);
        }}
      >
        <SelectTrigger  id={id} className={`w-full cursor-pointer ${triggerClassName} ${outlineButtonStyle}`}>
          <SelectValue placeholder={placeholder} className="" />

          {/* {selectedItem?.startIcon && <span className="w-[16px] ">{selectedItem.startIcon}</span>}
          <span className="truncate flex-1 text-left">
            {selectedItem ? selectedItem.label : <span className="text-muted-foreground">{placeholder}</span>}
          </span>
          {selectedItem?.endIcon && <span className="ml-auto w-[16px] ">{selectedItem.endIcon}</span>} */}
        </SelectTrigger>

        <SelectContent side={side} align={align} className={`max-h-[300px]  ${contentClassName}`}>
          <SelectGroup>
            {/* <SelectLabel>Fruits</SelectLabel> */}
            {items.length ? (
              // add max width for truncate to work
              items.map((item, index) => (
                <SelectItem key={`${item.value}-${index}`} value={item.value.toString()} className="cursor-pointer">
                  <div className=" flex items-center gap-2">
                    {item.startIcon && <div className="w-4   ">{item.startIcon}</div>}
                    <div className="flex-1 ">{item.label}</div>
                    {item.endIcon && <div className="ml-auto w-4 ">{item.endIcon}</div>}
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
