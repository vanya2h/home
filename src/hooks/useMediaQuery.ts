import { useEffect, useState } from "react";

/**
 * Subscribes to a media query. For styling, prefer Tailwind's responsive variants — this is for
 * values that aren't CSS at all, like props handed to a canvas or shader.
 *
 * Returns false until mounted, so server output matches the first client render. Callers should pick
 * the query so that false is the desktop/default case.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    const sync = () => setMatches(list.matches);

    sync();

    list.addEventListener("change", sync);

    return () => list.removeEventListener("change", sync);
  }, [query]);

  return matches;
}
