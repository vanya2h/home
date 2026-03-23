import React from "react";

import { cn } from "@/lib/utils";

export type IDashedBorder = React.ComponentProps<"svg"> & {
  borderRadius?: number;
};

export function DashedBorder({ className, borderRadius = 12, ...svgProps }: IDashedBorder) {
  return (
    <svg
      className={cn("absolute inset-0", className)}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      {...svgProps}
    >
      <rect
        className="stroke-foreground/60"
        width="100%"
        height="100%"
        fill="none"
        rx={borderRadius}
        ry={borderRadius}
        strokeWidth="1"
        strokeDasharray="5, 10"
        strokeDashoffset="0"
        strokeLinecap="square"
      />
    </svg>
  );
}
