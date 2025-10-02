"use client";

import * as React from "react";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import { Input } from "@delegatte/ui/components/input";
import { Button } from "@delegatte/ui/components/button";
import { cn } from "@delegatte/ui/lib/utils";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn(
          "pr-10",
          typeof className === "string" ? className : undefined
        )}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute right-0 top-0 h-full rounded-l-none rounded-r-md border-b border-l-0 border-r border-t bg-primary-foreground px-2 py-1"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={
          (typeof props.value === "string" ? props.value === "" : false) ||
          !!props.disabled
        }
      >
        {showPassword ? (
          <EyeNoneIcon className="size-2" aria-hidden="true" />
        ) : (
          <EyeOpenIcon className="size-2" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
