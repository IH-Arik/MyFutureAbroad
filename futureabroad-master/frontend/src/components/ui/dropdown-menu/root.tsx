import * as React from "react";
import { DropdownMenu } from "radix-ui";

export function DropdownMenuRoot({ ...props }: React.ComponentProps<typeof DropdownMenu.Root>) {
  return <DropdownMenu.Root data-slot="dropdown-menu" {...props} />;
}

export function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof DropdownMenu.Portal>) {
  return <DropdownMenu.Portal data-slot="dropdown-menu-portal" {...props} />;
}

export function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenu.Trigger>) {
  return <DropdownMenu.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

export default {} as any;
