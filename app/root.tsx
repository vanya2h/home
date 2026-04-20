import { QueryClientProvider } from "@tanstack/react-query";
import {
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
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

import { queryClient } from "@/query-client";
import { SupportedChainEnum } from "@/wagmi/chains";
import { createRpcDictionary, getWagmiConfig } from "@/wagmi/config";

export async function loader({ request }: LoaderFunctionArgs) {
  const headers = Object.fromEntries(request.headers);

  return {
    cookies: headers.cookie,
  };
}

const GA_ID = import.meta.env.VITE_GA;

const wagmiConfig = getWagmiConfig({
  rpcs: createRpcDictionary({
    [SupportedChainEnum.MAINNET]: import.meta.env.VITE_MAINNET_RPC,
  }),
});

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const initialState = cookieToInitialState(wagmiConfig, data?.cookies);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Hire Vanya2h" />
        <meta property="og:description" content="This is my homepage. I love TypeScript and Ethereum." />
        <meta property="og:image" content="/asterisk.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:url" content="https://vanya2h.me" />

        {/* Twitter fallback */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/asterisk.png" />
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
        <QueryClientProvider client={queryClient}>
          <WagmiProvider initialState={initialState} config={wagmiConfig}>
            {children}
          </WagmiProvider>
        </QueryClientProvider>
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
