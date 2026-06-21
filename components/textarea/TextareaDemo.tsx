"use client";

import React, { ReactNode, useId } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

type InputDemoProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  label?: ReactNode;
  errorMessage?: string;
  successMessage?: string;
};

export function TextareaDemo({
  className = "",
  inputClassName = "",
  labelClassName = "",
  label = "",
  successMessage = "",
  errorMessage = "",
  ...props
}: InputDemoProps) {
  const id = useId();

  return (
    <div className={`field grid items-center gap-1.5 ${className}`}>
      {label && (
        <Label htmlFor={id} className={`w-fit ${labelClassName}`}>
          {label}
        </Label>
      )}
      <Textarea id={id} {...props} className={`${inputClassName} min-h-[100px]`} />
      {successMessage && <div className="valid-feedback text-gray-700 text-xs">{successMessage}</div>}
      {errorMessage && <div className="invalid-feedback text-red-600 text-xs">{errorMessage}</div>}
    </div>
  );
}
