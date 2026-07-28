import { ArrowLeft } from "lucide-react";
import { isRouteErrorResponse, Link, type LoaderFunctionArgs, useRouteError } from "react-router";
import type { Route } from "./+types/$slug";

import { ParallaxCoverHeader } from "@/components/common/ParallaxCoverHeader";
import { AnchorUnderline } from "@/components/typography";
import { getPost } from "@/lib/blog";
import { buildMeta, siteUrlFromMatches } from "@/lib/seo";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = getPost(params.slug!);
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  return {
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    slug: post.slug,
  };
}

export function meta({ loaderData, matches }: Route.MetaArgs) {
  if (!loaderData) {
    return [{ title: "Post not found — Vanya2h" }];
  }
  return buildMeta({
    siteUrl: siteUrlFromMatches(matches),
    title: loaderData.title,
    description: loaderData.excerpt,
    path: `/blog/${loaderData.slug}`,
    ogImage: true,
    seed: loaderData.slug,
    type: "article",
  });
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="relative flex min-h-screen flex-col">{children}</div>;
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const post = getPost(loaderData.slug);
  if (!post) return null;
  const { Component } = post;

  return (
    <Shell>
      <ParallaxCoverHeader
        slug={loaderData.slug}
        title={loaderData.title}
        excerpt={loaderData.excerpt}
        date={loaderData.date}
      >
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </ParallaxCoverHeader>

      <div className="relative flex-1">
        <div className="mx-auto max-w-4xl px-6 py-8 md:px-12 md:py-12">
          <article className="prose-blog relative">
            <Component />
          </article>
        </div>
      </div>
    </Shell>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <Shell>
      <div className="m-auto max-w-md p-8 text-center">
        <h1 className="text-2xl font-heading mb-4">{is404 ? "Post not found" : "Something went wrong"}</h1>
        <p className="text-foreground/70">
          <AnchorUnderline href="/">Back to home</AnchorUnderline>
        </p>
      </div>
    </Shell>
  );
}
