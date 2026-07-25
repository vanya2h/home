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
      <H2 className="mb-6 text-foreground/90">My Writings</H2>
      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className={cn(
              "block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
              state === "visible" && "animate-mask-reveal-up",
            )}
            style={
              state === "hidden" ? { opacity: 0 } : state === "visible" ? { animationDelay: `${i * 120}ms` } : undefined
            }
          >
            <Card className="flex-row items-stretch gap-0 overflow-hidden p-0">
              <Cover slug={post.slug} className="w-28 shrink-0 sm:w-48" />
              <CardHeader className="flex-1 border-l border-white/15 py-6 gap-0">
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <CardDescription className="mt-1 text-sm text-white/50">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
                <CardDescription className="mt-3 text-white/70">{post.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
