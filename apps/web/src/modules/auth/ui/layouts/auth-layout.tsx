import React from "react";

import { GridPattern } from "@/components/grid-pattern";

interface AuthLayoutProps extends React.PropsWithChildren {
  children: React.ReactNode;
  isAuth?: boolean;
}
export const AuthLayout = ({ children, isAuth }: AuthLayoutProps) => {
  if (isAuth === true) {
    return (
      <div className="flex flex-col min-h-screen min-w-screen items-center justify-center">
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
  } else {
    return (
      <div className="flex flex-col min-h-screen min-w-screen items-center justify-center">
        {children}
      </div>
    );
  }
};
