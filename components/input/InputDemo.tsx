"use client";

import React, { useState, useEffect, ReactNode, useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type InputDemoProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  inputClassName?: string;
  label?: ReactNode;
  errorMessage?: string;
  successMessage?: string;
};

export function InputDemo({
  className = "",
  inputClassName = "",
  label = "",
  successMessage = "",
  errorMessage = "",
  ...props
}: InputDemoProps) {
  const id = useId();

  return (
    <div className={`field grid items-center gap-1.5 relative ${className}`}>
      {label && (
        <Label htmlFor={id} className="w-fit mb-3">
          {label}
        </Label>
      )}
      <Input id={id} {...props}  className={`${inputClassName}`} />
      {successMessage && <div className="valid-feedback text-green-600 text-xs">{successMessage}</div>}
      {errorMessage && <div className="invalid-feedback text-red-600 text-xs">{errorMessage}</div>}
    </div>
  );
}
