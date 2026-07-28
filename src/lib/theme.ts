export type Theme = "light" | "dark";

/** localStorage key. The no-flash script below and AnimatedThemeToggler must agree on this. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Runs as a blocking inline script in <head>, before first paint, so the page never flashes
 * the wrong theme. Kept as a string because it has to execute before React hydrates.
 *
 * Reads an explicit choice from localStorage first; with none stored, follows the OS. Both
 * reads are guarded — localStorage throws in some privacy modes, and matchMedia is missing
 * in very old browsers. Any failure leaves the document in its default (light) state.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var isDark =
      stored === "dark" ||
      stored === "light"
        ? stored === "dark"
        : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

/** Whether the visitor has picked a theme explicitly, as opposed to inheriting the OS one. */
export function hasStoredTheme(): boolean {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" || stored === "light";
  } catch {
    return false;
  }
}
