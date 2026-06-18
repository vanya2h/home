import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { H2 } from "@/components/typography";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type PkgSize = "hero" | "default";

type Pkg = {
  name: string;
  description: string;
  href: string;
  size: PkgSize;
  span: string; // md+ grid placement classes
};

const GH = "https://github.com/vanya2h";
const STAGGER_MS = 60;

// Order matters: this sequence tiles the 12-col grid with no gaps.
const packages: Pkg[] = [
  {
    name: "rxfy",
    description: "Minimalistic reactive state framework — declare typed models and query them as observables.",
    href: `${GH}/rxfy/tree/main/packages/rxfy`,
    size: "hero",
    span: "md:col-span-8 md:row-span-2",
  },
  {
    name: "form-factory",
    description: "Typed, composable form builder.",
    href: `${GH}/common/tree/main/packages/form-factory`,
    size: "hero",
    span: "md:col-span-4 md:row-span-2",
  },
  {
    name: "rxfy-react",
    description: "Official React bindings for rxfy, incl. Next.js App Router support.",
    href: `${GH}/rxfy/tree/main/packages/rxfy-react`,
    size: "default",
    span: "md:col-span-4",
  },
  {
    name: "store-react",
    description: "React bindings for store.",
    href: `${GH}/common/tree/main/packages/store-react`,
    size: "default",
    span: "md:col-span-4",
  },
  {
    name: "async-actions",
    description: "Typed async action/state helpers.",
    href: `${GH}/common/tree/main/packages/async-actions`,
    size: "default",
    span: "md:col-span-4",
  },
  {
    name: "utils-rxjs",
    description: "RxJS utility operators and helpers.",
    href: `${GH}/common/tree/main/packages/utils-rxjs`,
    size: "default",
    span: "md:col-span-6",
  },
  {
    name: "utils-rxjs-react",
    description: "React hooks for RxJS observables.",
    href: `${GH}/common/tree/main/packages/utils-rxjs-react`,
    size: "default",
    span: "md:col-span-6",
  },
  {
    name: "utils-wagmi",
    description: "wagmi/viem utility helpers.",
    href: `${GH}/common/tree/main/packages/utils-wagmi`,
    size: "default",
    span: "md:col-span-6",
  },
  {
    name: "utils",
    description: "General-purpose TypeScript utilities.",
    href: `${GH}/common/tree/main/packages/utils`,
    size: "default",
    span: "md:col-span-6",
  },
];

type PackageCardProps = { pkg: Pkg; index: number; visible: boolean; hidden: boolean };

function PackageCard({ pkg, index, visible, hidden }: PackageCardProps) {
  return (
    <a
      href={pkg.href}
      target="_blank"
      rel="noreferrer"
      className={cn("group block", pkg.span, visible && "animate-soft-blur-in")}
      style={hidden ? { opacity: 0 } : visible ? { animationDelay: `${index * STAGGER_MS}ms` } : undefined}
    >
      <Card className="h-full bg-linear-to-br from-[#ff5297]/25 to-[#9f50d3]/25 border-[#ff5297]/40 transition-colors hover:border-white/40">
        <CardHeader>
          <h3 className={cn("font-heading font-semibold leading-none", pkg.size === "hero" ? "text-3xl" : "text-xl")}>
            {pkg.name}
          </h3>
          <CardDescription className={cn(pkg.size === "hero" ? "text-base" : "text-sm")}>
            {pkg.description}
          </CardDescription>
        </CardHeader>
        <div className="grow" />
        <CardFooter>
          <span className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors group-hover:text-foreground">
            <GitHubLogoIcon className="h-4 w-4" />
            View on GitHub
          </span>
        </CardFooter>
      </Card>
    </a>
  );
}

export function OpenSource() {
  const { ref, state } = useScrollReveal();
  const visible = state === "visible";
  const hidden = state === "hidden";

  return (
    <div ref={ref} className="w-full">
      <H2
        className={cn("mb-6 text-2xl font-heading tracking-wide text-foreground/90", visible && "animate-mask-reveal-up")}
        style={hidden ? { opacity: 0 } : undefined}
      >
        Open source
      </H2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:[grid-auto-rows:minmax(9rem,auto)]">
        {packages.map((pkg, i) => (
          <PackageCard key={pkg.name} pkg={pkg} index={i} visible={visible} hidden={hidden} />
        ))}
      </div>
    </div>
  );
}
