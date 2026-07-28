import { Button } from "@/components/ui/Button";
import { useIsDark } from "@/hooks/useIsDark";

const DOCS = "https://rxfy.vanya2h.me";
const GETTING_STARTED = "https://rxfy.vanya2h.me/getting-started";
const GITHUB = "https://github.com/vanya2h/rxfy";
const NPM = "https://www.npmjs.com/package/rxfy";

/** End-of-article promo for the rxfy library: logo, primary CTA, and quick links. */
export function RxfyCallout() {
  const isDark = useIsDark();
  return (
    <aside className="not-prose mt-10 overflow-hidden rounded-2xl border border-foreground/20 bg-background/50 p-6 sm:p-8">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex shrink-0 items-center justify-center rounded-2xl h-20 w-20">
          <img
            src={isDark ? "/rxfy-mark-white.svg" : "/rxfy-mark.svg"}
            alt="rxfy logo"
            width={48}
            height={48}
            className="m-0! h-full w-full select-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2
            style={{ margin: 0 }}
            className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Get started with rxfy!
          </h2>
          <p style={{ margin: 0 }} className="text-sm text-foreground/60">
            Typed models, normalized stores, and real-time sync — one source of truth from server to view.
          </p>
        </div>
        <Button asChild size="lg" variant="ghost">
          <a href={GETTING_STARTED} target="_blank" style={{ textDecoration: "none" }} rel="noreferrer">
            Get started <span aria-hidden="true">→</span>
          </a>
        </Button>
      </div>

      <div className="mt-8 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 border-t border-foreground/20 pt-6 text-sm md:justify-start">
        <a
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
        >
          rxfy on GitHub
        </a>
        <a
          href={NPM}
          target="_blank"
          rel="noreferrer"
          className="text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
        >
          rxfy on npm
        </a>
        <a
          href={DOCS}
          target="_blank"
          rel="noreferrer"
          className="text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
        >
          rxfy documentation
        </a>
      </div>
    </aside>
  );
}
