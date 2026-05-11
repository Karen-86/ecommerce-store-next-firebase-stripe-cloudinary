// "use client";
// import React, { useState, useEffect } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { v4 as uuidv4 } from "uuid";

// type CheckboxProps = {
//   id?: string;
//   className?: string;
//   label?: string;
//   variant?: "primary" | "success" | "warning" | "danger" | "dark" | "";
//   checked?: boolean;
//   disabled?: boolean;
//   callback?: (isChecked: boolean, id: string) => void;
// };

// const variants: {[key: string]: string} = {
//   success: "text-green-600 [&>button]:!border-green-600 [&>[data-state='checked']]:bg-green-600"
// }

// export function CheckboxDemo({
//   id="",
//   className = "",
//   label = "",
//   variant = "",
//   checked = false,
//   disabled = false,
//   callback = () => {},
// }: CheckboxProps) {
//   const [isChecked, setIsChecked] = useState(checked);

//   const handleChange = (checked: boolean) => {
//     setIsChecked(checked);
//     callback(checked, id);
//   };

//   useEffect(() => {
//     setIsChecked(checked);
//   }, [checked]);

//   return (
//     <div className={`checkbox flex items-center space-x-2 select-none ${className} ${variants[variant]}`}>
//       <Checkbox
//         checked={isChecked}
//         id={`${id}`}
//         disabled={disabled}
//         className={`cursor-pointer rounded-full border-black/30 [&_svg]:size-5! text-black! bg-white! `}
//         onCheckedChange={handleChange}
//       />
//       {label && (
//         <label
//           htmlFor={`${id}`}
//           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//         >
//           {label}
//         </label>
//       )}
//     </div>
//   );
// }


"use client";
import React, { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";

type CheckboxProps =  React.ComponentPropsWithoutRef<typeof Checkbox> & {
  className?: string;
  label?: string;
  variant?: "primary" | "success" | "warning" | "danger" | "dark" | "";
};

const variants: {[key: string]: string} = {
  success: "text-green-600 [&>button]:!border-green-600 [&>[data-state='checked']]:bg-green-600"
}

export function CheckboxDemo({
  className = "",
  label = "",
  variant = "",
  ...props
}: CheckboxProps) {
  const id = useId()

  return (
    <div className={`checkbox flex items-center space-x-2 select-none ${className} ${variants[variant]}`}>
      <Checkbox
        id={`${id}`}
        {...props}
        className={`cursor-pointer rounded-full border-black/30 [&_svg]:size-5! text-black! bg-white! `}
      />
      {label && (
        <label
          htmlFor={`${id}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
}
