"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";

type InputDemoProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  inputClassName?: string;
  label?: ReactNode;
  callback?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  successMessage?: string;
};

export function InputDemo({
  className = "",
  inputClassName = "",
  label = "",
  callback = () => {},
  successMessage = "",
  errorMessage = "",
  ...props
}: InputDemoProps) {
  const [id, setId] = useState("");

  useEffect(() => {
    setId(uuidv4());
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    callback(e);
  };

  return (
    <div className={`field grid items-center gap-1.5 relative ${className}`}>
      {label && <Label htmlFor={id} className="w-fit">{label}</Label>}
      <Input id={id} {...props} onChange={onChange} className={`${inputClassName}`} />
      {successMessage && <div className="valid-feedback text-green-600 text-xs">{successMessage}</div>}
      {errorMessage && <div className="invalid-feedback text-red-600 text-xs">{errorMessage}</div>}
    </div>
  );
}
