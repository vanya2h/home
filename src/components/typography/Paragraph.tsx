import { cn } from "@/lib/utils";

export function Paragraph({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("md:text-xl", className)} {...props} />;
}
