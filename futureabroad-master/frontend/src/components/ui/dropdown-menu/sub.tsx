import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "./icons";

export function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenu.Sub>) {
  return <DropdownMenu.Sub data-slot="dropdown-menu-sub" {...props} />;
}

export function DropdownMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof DropdownMenu.SubTrigger> & { inset?: boolean }) {
  return (
    <DropdownMenu.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn("focus:bg-accent data-[state=open]:bg-accent flex cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none data-[inset]:pl-8", className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenu.SubTrigger>
  );
}

export default {} as any;
