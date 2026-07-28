import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import { WagmiProvider } from "wagmi";
import { cookieToInitialState } from "wagmi";
import type { Route } from "./+types/root";
import "./app.css";

import { PageBackground } from "@/components/common/PageBackground";
import { AnimatedThemeToggler } from "@/components/ui/AnimatedThemeToggler";
import { buildMeta, siteUrlFromMatches } from "@/lib/seo";
import { hasStoredTheme, THEME_INIT_SCRIPT } from "@/lib/theme";
import { queryClient } from "@/query-client";
import { SupportedChainEnum } from "@/wagmi/chains";
import { createRpcDictionary, getWagmiConfig } from "@/wagmi/config";

export async function loader({ request, context }: Route.LoaderArgs) {
  const headers = Object.fromEntries(request.headers);

  return {
    cookies: headers.cookie,
    siteUrl: context.siteUrl,
  };
}

export function meta({ matches }: Route.MetaArgs) {
  return buildMeta({
    siteUrl: siteUrlFromMatches(matches),
    title: "Hire Vanya2h",
    description: "This is my awesome homepage.",
    path: "/",
  });
}

const GA_ID = import.meta.env.VITE_GA;

const wagmiConfig = getWagmiConfig({
  rpcs: createRpcDictionary({
    [SupportedChainEnum.MAINNET]: import.meta.env.VITE_MAINNET_RPC,
  }),
});

/**
 * Follows the OS colour scheme, but only while the visitor hasn't chosen a theme themselves.
 * Once they've toggled, `localStorage.theme` is set and their choice wins.
 */
function useSystemThemeSync() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (event: MediaQueryListEvent) => {
      if (hasStoredTheme()) return;
      document.documentElement.classList.toggle("dark", event.matches);
    };

    query.addEventListener("change", apply);

    return () => query.removeEventListener("change", apply);
  }, []);
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const initialState = cookieToInitialState(wagmiConfig, data?.cookies);

  useSystemThemeSync();

  return (
    // The theme script below mutates this element before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Must stay blocking and ahead of the stylesheet, so no wrong-theme frame paints. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Meta />
        <Links />
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <PageBackground />
        <QueryClientProvider client={queryClient}>
          <WagmiProvider initialState={initialState} config={wagmiConfig}>
            {children}
          </WagmiProvider>
        </QueryClientProvider>
        <AnimatedThemeToggler />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "icon", href: "/favicon.png" },
  { rel: "shortcut icon", href: "/favicon.png" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=BBH+Bartle&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
