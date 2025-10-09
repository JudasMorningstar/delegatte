import { Dispatch, SetStateAction } from "react";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@delegatte/ui/components/command";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find a project or task" />
      <CommandList>
        <CommandItem>Test</CommandItem>
      </CommandList>
    </CommandDialog>
  );
};
