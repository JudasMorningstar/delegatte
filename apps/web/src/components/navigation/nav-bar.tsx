"use client";

import { Button } from "@delegatte/ui/components/button";
import { Separator } from "@delegatte/ui/components/separator";
import { SidebarTrigger } from "@delegatte/ui/components/sidebar";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { DashboardCommand } from "./dash-command";

export const NavBar = () => {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Button
          variant="outline"
          className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-primary"
          size={"sm"}
          onClick={() => setCommandOpen((open) => !open)}
        >
          <MagnifyingGlassIcon />
          Search...
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">&#8984;</span>

            <span className="text-xs">K</span>
          </kbd>
        </Button>
      </header>
    </>
  );
};
