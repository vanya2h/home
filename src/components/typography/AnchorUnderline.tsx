import { cn } from "@/lib/utils";

export function AnchorUnderline({ className, ...props }: React.ComponentProps<"a">) {
  return <a className={cn("anchor-underline", className)} {...props} />;
}
