import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Package } from "lucide-react";
import { useState } from "react";

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
    description:
      "Minimalistic frontend framework that lets you declare models and states, then access it as reactive RxJs-native observables. With data normalization and granular reactivity at no extra cost.",
    href: `${GH}/rxfy/tree/main/packages/rxfy`,
    repo: "rxfy",
    tags: ["RxJS", "Zod", "TypeScript", "SSR"],
  },
  {
    name: "rxfy-react",
    description:
      "Official React bindings for rxfy — components subscribe to normalized entities and get live updates from a single shared copy. Ships hooks like useStateData, useModelStore and usePending, with first-class SSR and Next.js App Router support.",
    href: `${GH}/rxfy/tree/main/packages/rxfy-react`,
    repo: "rxfy",
    tags: ["React", "RxJS", "Next.js", "SSR"],
  },
  {
    name: "form-factory",
    description:
      "Headless, schema-driven form library on top of react-hook-form and Zod — it owns all the business logic and leaves the UI entirely to you. A factory pattern makes form declarations reusable, with async seeding via RxJS and a structured submit pipeline that handles errors and side effects cleanly.",
    href: `${GH}/common/tree/main/packages/form-factory`,
    repo: "common",
    tags: ["react-hook-form", "Zod", "RxJS", "TypeScript"],
  },

  {
    name: "async-actions",
    description:
      "Composable async action pipelines with built-in status tracking and retries. Wrap long-running operations as actions — individually or in sets — and observe their progress, instead of scattering loading and error flags across your components.",
    href: `${GH}/common/tree/main/packages/async-actions`,
    repo: "common",
    tags: ["TypeScript", "Immutable.js"],
  },
  {
    name: "utils-rxjs",
    description:
      "Custom RxJS building blocks for everyday stream work — a batcher, an observable cache factory, a persisted BehaviorSubject, and observable-like wrappers. Built on RxJS and Immutable.js to keep reactive pipelines concise and predictable.",
    href: `${GH}/common/tree/main/packages/utils-rxjs`,
    repo: "common",
    tags: ["RxJS", "Immutable.js", "TypeScript"],
  },
  {
    name: "utils-rxjs-react",
    description:
      "React hooks and components for consuming RxJS Observables and BehaviorSubjects without boilerplate. Late unwrapping passes observables down the tree and unwraps them at the leaves, so only the affected components re-render when data changes.",
    href: `${GH}/common/tree/main/packages/utils-rxjs-react`,
    repo: "common",
    tags: ["React", "RxJS"],
  },
  {
    name: "utils-wagmi",
    description:
      "Typed helpers over @wagmi/core and viem for everyday Web3 plumbing — resolve the connected account, query accounts by status, spin up public and wallet clients, and check whether an address is a contract. A thin layer that strips away the usual wagmi/viem boilerplate.",
    href: `${GH}/common/tree/main/packages/utils-wagmi`,
    repo: "common",
    tags: ["wagmi", "viem", "TypeScript"],
  },
  {
    name: "utils",
    description:
      "A grab-bag of common, well-typed TypeScript helpers — general runtime utilities plus a set of type-level utilities — shared across these packages. Dependency-light, with viem and Zod on hand for crypto and schema work.",
    href: `${GH}/common/tree/main/packages/utils`,
    repo: "common",
    tags: ["TypeScript", "Zod", "viem"],
  },
];

export function OpenSource() {
  const { ref, state } = useScrollReveal();
  const visible = state === "visible";
  const hidden = state === "hidden";

  const [selected, setSelected] = useState(0);
  const active = packages[selected];
  // common-monorepo packages publish under the @vanya2h scope; rxfy/rxfy-react publish unscoped.
  const npmName = active.repo === "rxfy" ? active.name : `@vanya2h/${active.name}`;

  return (
    <div ref={ref} className="w-full">
      <div
        className={cn("flex flex-col gap-6 md:flex-row md:gap-10", visible && "animate-soft-blur-in")}
        style={hidden ? { opacity: 0 } : undefined}
      >
        <ul className="flex flex-col gap-1 md:w-1/3">
          {packages.map((pkg, i) => {
            const isActive = i === selected;
            return (
              <li key={pkg.name}>
                <button
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onMouseEnter={() => setSelected(i)}
                  onFocus={() => setSelected(i)}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-2.5 text-left font-heading text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5297]/60",
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
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href={active.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-b border-dashed border-white/50 pb-0.5 text-sm text-white transition-colors hover:border-white"
              >
                <GitHubLogoIcon className="h-4 w-4" />
                View on GitHub
              </a>
              <a
                href={`https://www.npmjs.com/package/${npmName}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-b border-dashed border-white/50 pb-0.5 text-sm text-white transition-colors hover:border-white"
              >
                <Package className="h-4 w-4" />
                View on npm
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-12">
        <p
          className={cn("text-foreground/60", visible && "animate-mask-reveal-up")}
          style={hidden ? { opacity: 0 } : visible ? { animationDelay: "100ms" } : undefined}
        >
          My libraries and packages in Open source.
        </p>
      </div>
    </div>
  );
}
