import type React from "react";

import { GridPattern } from "@/components/grid-pattern";

interface AuthLayoutProps extends React.PropsWithChildren {
  children: React.ReactNode;
  isAuth?: boolean;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
}

export const AuthLayout = ({
  children,
  isAuth,
  maxWidth = "md",
}: AuthLayoutProps) => {
  const maxWidthClass = `max-w-${maxWidth}`;

  if (isAuth === true) {
    return (
      <div className="flex flex-col min-h-screen min-w-screen items-center justify-center px-4">
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className="[mask-image:radial-gradient(300px_circle_at_left_top,white,transparent)]"
        />
        <div className={`w-full ${maxWidthClass}`}>{children}</div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col min-h-screen min-w-screen items-center justify-center">
        {children}
      </div>
    );
  }
};
