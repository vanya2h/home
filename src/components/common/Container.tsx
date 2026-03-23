import { cn } from "@/lib/utils";

export function Row({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-6 md:px-8", className)} {...props} />;
}

export function Containers({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col m-auto max-w-3xl w-full gap-8 py-6 md:py-12", className)} {...props} />;
}
