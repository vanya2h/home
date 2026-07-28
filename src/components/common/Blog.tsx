import { Link } from "react-router";

import { Cover } from "@/components/common/Cover";
import { H2 } from "@/components/typography";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { posts } from "@/lib/blog";
import { cn } from "@/lib/utils";

export function Blog() {
  const { ref, state } = useScrollReveal();

  return (
    <div ref={ref} className="flex w-full flex-col">
      <H2
        className={cn("mb-6 text-foreground/90", state === "visible" && "animate-mask-reveal-up")}
        style={state === "hidden" ? { opacity: 0 } : undefined}
      >
        My Writings
      </H2>
      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className={cn(
              "block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              state === "visible" && "animate-mask-reveal-up",
            )}
            style={
              state === "hidden"
                ? { opacity: 0 }
                : state === "visible"
                  ? { animationDelay: `${(i + 1) * 120}ms` }
                  : undefined
            }
          >
            <Card className="flex-col items-stretch gap-0 overflow-hidden p-0 sm:flex-row">
              <Cover slug={post.slug} className="h-32 w-full shrink-0 sm:h-auto sm:w-48" />
              <CardHeader className="flex-1 border-t border-surface-border px-5 py-5 gap-0 sm:border-t-0 sm:border-l sm:px-6 sm:py-6">
                <CardTitle className="text-xl sm:text-2xl">{post.title}</CardTitle>
                <CardDescription className="mt-1 text-sm text-foreground/50">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
                <CardDescription className="mt-3 text-sm text-foreground/70 sm:text-base">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
