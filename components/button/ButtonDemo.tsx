"use client";

import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ButtonDemoProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  text?: ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "outlineDanger"
    | "secondary"
    | "ghost"
    | "link"
    | "success"
    | "dark"
    | "light"
    | "ghostDanger"
    | "ghostStrong"
    | "ghostSecondary"
    | "ghostYellow";
  size?: "default" | "xs" | "sm" | "lg" | "xl" | "icon" | "icon-sm" | "icon-lg" | null | undefined;
  icon?: ReactElement | null;
  startIcon?: ReactElement | null;
  endIcon?: ReactElement | null;
  disabled?: boolean;
};

export function ButtonDemo({
  className = "",
  text = "",
  variant = "default",
  size = "default",
  icon = null,
  startIcon = null,
  endIcon = null,
  color = "defaultColor",
  disabled = false,
  children,
  ...props
}: ButtonDemoProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      className={`${className} cursor-pointer fill-current`}
      {...props}
    >
      {startIcon}
      {text}
      {icon}
      {children}
      {endIcon}
      {/* <div data-type={type}></div> */}
    </Button>
  );
}
