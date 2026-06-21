// "use client";

// import React, { useId } from "react";
// import {
//   Combobox,
//   ComboboxContent,
//   ComboboxEmpty,
//   ComboboxInput,
//   ComboboxItem,
//   ComboboxList,
// } from "@/components/ui/combobox";
// import { Label } from "@/components/ui/label";
// import { ChevronDown, Search } from "lucide-react";
// import { InputGroupAddon } from "@/components/ui/input-group";

// export type SelectItemBasicType = {
//   label: string | number;
//   value: string | number;
//   startIcon?: React.ReactElement;
//   endIcon?: React.ReactElement;
// };

// type ComboboxPopupProps = {
//   items: SelectItemBasicType[];
//   value: SelectItemBasicType | null; // controlled
//   onChange: (item: SelectItemBasicType) => void;

//   label?: string;
//   placeholder?: string;

//   className?: string;
//   contentClassName?: string;

//   side?: "top" | "right" | "bottom" | "left";
//   align?: "start" | "center" | "end";

//   successMessage?: string;
//   errorMessage?: string;
// };

// export function ComboboxBasic({
//   items = [],
//   value,
//   onChange = () => {},

//   label = "",
//   placeholder = "Select",

//   className = "",
//   contentClassName = "",

//   side = "bottom",
//   align = "center",

//   successMessage = "",
//   errorMessage = "",
// }: ComboboxPopupProps) {
//   const id = useId();

//   return (
//     <div className={`grid items-center gap-1.5 relative  ${className}`}>
//       {label && (
//         <Label htmlFor={id} className="w-fit">
//           {label}
//         </Label>
//       )}
//       <Combobox
//         items={items}
//         value={value}
//         onValueChange={(item) => {
//           if (item) onChange(item);
//         }}
//       >
//         {/* <ComboboxInput id={id} placeholder={placeholder} showClear /> */}
//         <ComboboxInput id={id} placeholder={placeholder} showClear className=''>
//           <InputGroupAddon>
//             <Search />
//           </InputGroupAddon>
//         </ComboboxInput>

//         <ComboboxContent
//           side={side}
//           align={align}
//           className={`${contentClassName}`}
//         >
//           <ComboboxEmpty>No items found.</ComboboxEmpty>
//           <ComboboxList>
//             {(item) => (
//               <ComboboxItem key={item.value} value={item} className="cursor-pointer">
//                 {item.startIcon && <span className="w-[16px] ">{item.startIcon}</span>}
//                 <span className="combobox-demo-text flex-1">{item.label}</span>
//                 {item.endIcon && <span className="ml-auto w-[16px] ">{item.endIcon}</span>}
//               </ComboboxItem>
//             )}
//           </ComboboxList>
//         </ComboboxContent>
//       </Combobox>

//       {successMessage && <div className="valid-feedback text-green-600 text-xs">{successMessage}</div>}
//       {errorMessage && <div className="invalid-feedback text-red-600 text-xs">{errorMessage}</div>}
//     </div>
//   );
// }
