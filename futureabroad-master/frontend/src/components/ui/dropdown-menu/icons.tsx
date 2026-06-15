import * as React from "react";
import { cn } from "@/lib/utils";

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-4", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);

export const CircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("size-2 fill-current", className)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
);

export default {} as any;
