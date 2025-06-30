import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "badge",
        variant === "default" && "badge-gray",
        variant === "success" && "badge-success",
        variant === "warning" && "badge-warning", 
        variant === "danger" && "badge-danger",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
