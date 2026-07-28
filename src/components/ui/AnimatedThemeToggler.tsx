import { Moon, Sun } from "lucide-react";
import { useCallback, useRef } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/Button";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Vendored from https://magicui.design/r/animated-theme-toggler.json.
 *
 * Deviations from upstream, all deliberate — keep them if you re-pull the registry source:
 *
 *   1. Circle variant only. Upstream ships seven clip-path shapes (square, triangle, star, …)
 *      behind a `variant` prop; the polygon maths for the six unused ones is dropped.
 *   2. Icons are CSS-driven (`dark:hidden`) rather than rendered from React state. Upstream
 *      seeds its state to `false` and corrects in an effect, so SSR emits the wrong icon for
 *      one frame. The `dark` class is on <html> before first paint, so CSS gets this right
 *      with no JS and no observer.
 *   3. Honours `prefers-reduced-motion`, reusing upstream's no-View-Transitions fallback.
 *
 * Because of (2) this component holds no theme state at all — it reads the class when
 * clicked and writes it back. `THEME_STORAGE_KEY` must match the no-flash script's key.
 */

/**
 * Percentages, not pixels: Chrome 150 renders absolute px clip-path coordinates on
 * ::view-transition-new(root) unscaled at fractional display scales, which lands the reveal
 * in the wrong place on the first transition after load (magicui#989).
 */
function circleClipPaths(cx: number, cy: number, viewportWidth: number, viewportHeight: number): [string, string] {
  const at = `${(cx / viewportWidth) * 100}% ${(cy / viewportHeight) * 100}%`;
  const maxRadius = Math.hypot(Math.max(cx, viewportWidth - cx), Math.max(cy, viewportHeight - cy));
  // circle() percentage radii resolve against hypot(w, h) / sqrt(2) of the reference box.
  const radius = (maxRadius / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100;

  return [`circle(0% at ${at})`, `circle(${radius}% at ${at})`];
}

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export function AnimatedThemeToggler({ className, duration = 400, ...props }: AnimatedThemeTogglerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTransitioningRef = useRef(false);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button || isTransitioningRef.current) return;

    const root = document.documentElement;

    const applyTheme = () => {
      // Toggle synchronously, so View Transitions snapshots the new theme inside the callback.
      const isDark = root.classList.toggle("dark");
      try {
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
      } catch {
        // Private modes can refuse writes; the theme still applies for this page view.
      }
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    // innerWidth/innerHeight rather than visualViewport: percentages resolve against the
    // snapshot reference box, which includes classic scrollbars.
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const { top, left, width, height } = button.getBoundingClientRect();
    const clipPath = circleClipPaths(left + width / 2, top + height / 2, viewportWidth, viewportHeight);

    root.dataset.themeVt = "active";
    root.style.setProperty("--theme-vt-duration", `${duration}ms`);
    // Pins the collapsed clip-path in CSS so Firefox doesn't paint the new theme unclipped
    // between the snapshot and the ready.then() animation below.
    root.style.setProperty("--theme-vt-clip-from", clipPath[0]);

    const cleanup = () => {
      isTransitioningRef.current = false;
      delete root.dataset.themeVt;
      root.style.removeProperty("--theme-vt-duration");
      root.style.removeProperty("--theme-vt-clip-from");
    };

    isTransitioningRef.current = true;
    const transition = document.startViewTransition(() => flushSync(applyTheme));

    void transition.finished.finally(cleanup).catch(() => {});
    void transition.ready
      .then(() => {
        root.animate(
          { clipPath },
          {
            duration,
            easing: "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {});
  }, [duration]);

  return (
    <Button
      className={cn("fixed bottom-10 left-10 z-50", className)}
      onClick={toggleTheme}
      ref={buttonRef}
      size="icon-lg"
      style={{
        marginBottom: "env(safe-area-inset-bottom)",
        marginLeft: "env(safe-area-inset-left)",
      }}
      type="button"
      variant="ghost"
      {...props}
    >
      <Moon className="size-4.5 dark:hidden" />
      <Sun className="hidden size-4.5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
