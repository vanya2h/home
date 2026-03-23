export function InlineBadge({ ...props }: React.ComponentProps<"span">) {
  return <span className="inline text-foreground border-b-2 border-b-primary" {...props} />;
}
