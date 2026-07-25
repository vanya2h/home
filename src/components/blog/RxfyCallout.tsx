const DOCS = "https://rxfy.vanya2h.me";
const GETTING_STARTED = "https://rxfy.vanya2h.me/getting-started";
const GITHUB = "https://github.com/vanya2h/rxfy";
const NPM = "https://www.npmjs.com/package/rxfy";

/** End-of-article promo for the rxfy library: logo, primary CTA, and quick links. */
export function RxfyCallout() {
  return (
    <aside className="not-prose mt-10 overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-md sm:p-8">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex shrink-0 items-center justify-center rounded-2xl h-20 w-20">
          <img
            src="/rxfy-mark-white.svg"
            alt="rxfy logo"
            width={48}
            height={48}
            className="m-0! h-full w-full select-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2
            style={{ margin: 0 }}
            className="font-heading text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            Get started with rxfy!
          </h2>
          <p style={{ margin: 0 }} className="text-sm text-white/60">
            Typed models, normalized stores, and real-time sync — one source of truth from server to view.
          </p>
        </div>
        <a
          href={GETTING_STARTED}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#8243AC] px-5 py-2.5 text-sm font-semibold text-white no-underline! transition-colors hover:bg-[#9451bd]"
        >
          Get started <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="mt-8 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-sm md:justify-start">
        <a
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="text-white/70 underline-offset-4 hover:text-white hover:underline"
        >
          rxfy on GitHub
        </a>
        <a
          href={NPM}
          target="_blank"
          rel="noreferrer"
          className="text-white/70 underline-offset-4 hover:text-white hover:underline"
        >
          rxfy on npm
        </a>
        <a
          href={DOCS}
          target="_blank"
          rel="noreferrer"
          className="text-white/70 underline-offset-4 hover:text-white hover:underline"
        >
          rxfy documentation
        </a>
      </div>
    </aside>
  );
}
