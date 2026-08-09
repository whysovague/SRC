import type { Section } from "./types";

// ─── URL map ──────────────────────────────────────────────────────────────────
// Single source of truth pairing each Section with its public path. The rest of
// the app still speaks in Sections; only App translates to and from the URL.

export const SECTION_PATHS: Record<Section, string> = {
  home: "/",
  competitions: "/competitions",
  agenda: "/agenda",
  partnership: "/partnership",
  faq: "/faq",
  contact: "/contact",
  // Deep-linked from the confirmation email as /complete-profile?t=<token>.
  // pathToSection only looks at the pathname, so the token survives the match.
  "complete-profile": "/complete-profile",
};

const PATH_TO_SECTION = new Map<string, Section>(
  (Object.entries(SECTION_PATHS) as [Section, string][]).map(([s, p]) => [p, s])
);

export function sectionToPath(section: Section): string {
  return SECTION_PATHS[section] ?? "/";
}

/** Resolve a pathname to a Section, or null when the URL matches no page. */
export function pathToSection(pathname: string): Section | null {
  // tolerate trailing slashes: /faq/ and /faq are the same page
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PATH_TO_SECTION.get(clean || "/") ?? null;
}
