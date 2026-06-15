import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";

export function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenu.Label> & { inset?: boolean }) {
  return (
    <DropdownMenu.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground data-[inset]:pl-8", className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenu.Separator>) {
  return <DropdownMenu.Separator data-slot="dropdown-menu-separator" className={cn("bg-border -mx-1 my-1 h-px", className)} {...props} />;
}

export function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="dropdown-menu-shortcut" className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)} {...props} />
  );
}

export default {} as any;
