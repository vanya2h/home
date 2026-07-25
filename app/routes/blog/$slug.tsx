import { ArrowLeft } from "lucide-react";
import { isRouteErrorResponse, Link, type LoaderFunctionArgs, useRouteError } from "react-router";
import type { Route } from "./+types/$slug";

import { Cover } from "@/components/common/Cover";
import { DashedBorder } from "@/components/common/DashedBorder";
import { MeshBackground } from "@/components/common/MeshBackground";
import { AnchorUnderline } from "@/components/typography";
import { getPost } from "@/lib/blog";

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

export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [{ title: "Post not found" }];
  }
  return [{ title: `${data.title} — Vanya2h` }, { name: "description", content: data.excerpt }];
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* page background: the mesh gradient shared with the main page */}
      <MeshBackground />
      {children}
    </div>
  );
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const post = getPost(loaderData.slug);
  if (!post) return null;
  const { Component } = post;

  return (
    <Shell>
      {/* cover: full page width, flush to the top, no radius/padding/margin */}
      <div className="relative border-b border-white/15">
        <Cover slug={loaderData.slug} className="h-64 md:h-80">
          <div className="max-w-3xl mt-12 mb-6">
            <h1 className="font-heading text-2xl leading-tight text-white md:text-4xl">{loaderData.title}</h1>
            <p className="mt-3 text-lg text-white/80">{loaderData.excerpt}</p>
            <p className="mt-4 text-white/60">
              {new Date(loaderData.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </Cover>
        <Link
          to="/"
          className="absolute left-4 top-4 z-20 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* dashed border spans the full page width; article is centered inside it */}
      <div className="relative flex-1">
        {/* <DashedBorder borderRadius={8} className="p-4" /> */}
        <div className="mx-auto max-w-4xl px-6 py-8 md:px-12 md:py-20">
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
        <p className="text-white/70">
          <AnchorUnderline href="/">Back to home</AnchorUnderline>
        </p>
      </div>
    </Shell>
  );
}
