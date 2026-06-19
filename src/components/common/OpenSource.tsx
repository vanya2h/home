import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { H2 } from "@/components/typography";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type Pkg = {
  name: string;
  description: string;
  href: string;
  repo: "common" | "rxfy";
  tags: string[];
};

const GH = "https://github.com/vanya2h";

const packages: Pkg[] = [
  {
    name: "rxfy",
    description: "Minimalistic reactive state framework — declare typed models and query them as observables.",
    href: `${GH}/rxfy/tree/main/packages/rxfy`,
    repo: "rxfy",
    tags: ["RxJS", "Zod", "TypeScript", "SSR"],
  },
  {
    name: "form-factory",
    description: "Typed, composable form builder.",
    href: `${GH}/common/tree/main/packages/form-factory`,
    repo: "common",
    tags: ["React", "TypeScript", "Forms"],
  },
  {
    name: "rxfy-react",
    description: "Official React bindings for rxfy, incl. Next.js App Router support.",
    href: `${GH}/rxfy/tree/main/packages/rxfy-react`,
    repo: "rxfy",
    tags: ["React", "RxJS", "Next.js"],
  },
  {
    name: "store-react",
    description: "React bindings for store.",
    href: `${GH}/common/tree/main/packages/store-react`,
    repo: "common",
    tags: ["React", "RxJS"],
  },
  {
    name: "async-actions",
    description: "Typed async action/state helpers.",
    href: `${GH}/common/tree/main/packages/async-actions`,
    repo: "common",
    tags: ["RxJS", "TypeScript"],
  },
  {
    name: "utils-rxjs",
    description: "RxJS utility operators and helpers.",
    href: `${GH}/common/tree/main/packages/utils-rxjs`,
    repo: "common",
    tags: ["RxJS"],
  },
  {
    name: "utils-rxjs-react",
    description: "React hooks for RxJS observables.",
    href: `${GH}/common/tree/main/packages/utils-rxjs-react`,
    repo: "common",
    tags: ["React", "RxJS"],
  },
  {
    name: "utils-wagmi",
    description: "wagmi/viem utility helpers.",
    href: `${GH}/common/tree/main/packages/utils-wagmi`,
    repo: "common",
    tags: ["wagmi", "viem"],
  },
  {
    name: "utils",
    description: "General-purpose TypeScript utilities.",
    href: `${GH}/common/tree/main/packages/utils`,
    repo: "common",
    tags: ["TypeScript"],
  },
];

export function OpenSource() {
  const { ref, state } = useScrollReveal();
  const visible = state === "visible";
  const hidden = state === "hidden";

  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const activeIndex = hovered ?? selected;
  const active = packages[activeIndex];

  return (
    <div ref={ref} className="w-full">
      <H2
        className={cn("mb-6 text-2xl font-heading tracking-wide text-foreground/90", visible && "animate-mask-reveal-up")}
        style={hidden ? { opacity: 0 } : undefined}
      >
        Open source
      </H2>

      <div
        className={cn("flex flex-col gap-6 md:flex-row md:gap-10", visible && "animate-soft-blur-in")}
        style={hidden ? { opacity: 0 } : undefined}
      >
        <ul className="flex flex-col gap-1 md:w-1/3" onMouseLeave={() => setHovered(null)}>
          {packages.map((pkg, i) => {
            const isActive = i === activeIndex;
            return (
              <li key={pkg.name}>
                <button
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-2.5 text-left font-heading text-lg transition-colors",
                    isActive
                      ? "border-[#ff5297]/40 bg-linear-to-br from-[#ff5297]/25 to-[#9f50d3]/25 text-white"
                      : "border-transparent text-foreground/70 hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {pkg.name}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex-1 rounded-xl border border-white/15 bg-white/5 p-6 md:p-8">
          <div key={active.name} className="flex h-full animate-soft-blur-in flex-col">
            <p className="mb-2 text-xs uppercase tracking-[0.08em] text-foreground/50">{active.repo} monorepo</p>
            <h3 className="mb-3 text-3xl font-heading font-semibold text-white">{active.name}</h3>
            <p className="mb-5 leading-relaxed text-foreground/80">{active.description}</p>
            <div className="mb-auto flex flex-wrap gap-2">
              {active.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={active.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 self-start border-b border-dashed border-white/50 pb-0.5 text-sm text-white transition-colors hover:border-white"
            >
              <GitHubLogoIcon className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
