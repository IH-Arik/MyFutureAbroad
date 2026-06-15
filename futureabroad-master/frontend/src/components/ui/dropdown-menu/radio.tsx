import * as React from "react";
import { DropdownMenu } from "radix-ui";

export function DropdownMenuRadioGroup({ ...props }: React.ComponentProps<typeof DropdownMenu.RadioGroup>) {
  return <DropdownMenu.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

export default {} as any;
