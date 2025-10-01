import React from "react";

import { GridPattern } from "@/components/grid-pattern";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className="[mask-image:radial-gradient(300px_circle_at_left_top,white,transparent)]"
      />
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
