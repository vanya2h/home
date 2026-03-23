import { cn } from "@/lib/utils";

export function H1({ className, ...restProps }: React.ComponentProps<"h1">) {
  return <h1 className={cn("text-4xl font-heading", className)} {...restProps} />;
}

export function H2({ className, ...restProps }: React.ComponentProps<"h1">) {
  return <h2 className={cn("text-3xl font-heading", className)} {...restProps} />;
}
