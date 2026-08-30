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
  attendance: "/attend",
  // Unlisted, for the organising team. Deliberately absent from the navbar, the
  // footer and sitemap.xml; the slug is random so the path cannot be guessed.
  registrants: "/registrants-x7k2m9",
};

const PATH_TO_SECTION = new Map<string, Section>(
  (Object.entries(SECTION_PATHS) as [Section, string][]).map(([s, p]) => [p, s])
);

// ─── Per-page metadata ────────────────────────────────────────────────────────
// index.html carries the metadata for the home page; App applies these when the
// visitor navigates, so every page has its own title and description in the tab,
// in shared links and for crawlers that render JavaScript.
//
// Keep "SRC", "KFUPM" and "AIChE" in every title — those are the terms people
// search for.

export const SITE_NAME = "SRC 2026";

export const PAGE_META: Record<Section, { title: string; description: string }> = {
  home: {
    title: "SRC 2026 | AIChE Student Regional Conference at KFUPM",
    description:
      "SRC 2026 — the first AIChE Student Regional Conference in the GCC, hosted by the KFUPM AIChE Student Chapter in Dhahran, Saudi Arabia, August 31 – September 2, 2026.",
  },
  competitions: {
    title: "Competitions & Activities | SRC 2026 KFUPM AIChE",
    description:
      "Chem-E-Car, ChemE Jeopardy, the Undergraduate Poster Competition and the Student Technical Presentation Competition at SRC 2026, KFUPM.",
  },
  agenda: {
    title: "Agenda | SRC 2026 KFUPM AIChE",
    description:
      "The three-day schedule for SRC 2026 at KFUPM, Dhahran — competitions, keynote sessions, workshops and networking, August 31 to September 2, 2026.",
  },
  partnership: {
    title: "Partnership & Sponsorship | SRC 2026 KFUPM AIChE",
    description:
      "Partner with SRC 2026 at KFUPM and reach chemical engineering students from across the GCC. Explore sponsorship packages and request a proposal.",
  },
  faq: {
    title: "FAQ | SRC 2026 KFUPM AIChE",
    description:
      "Answers about eligibility, AIChE membership, competition rules, conference hours and registration for SRC 2026 at KFUPM.",
  },
  contact: {
    title: "Contact | SRC 2026 KFUPM AIChE",
    description:
      "Get in touch with the SRC 2026 organizing team at the KFUPM AIChE Student Chapter, Dhahran, Saudi Arabia.",
  },
  attendance: {
    title: "Attendance | SRC 2026 KFUPM AIChE",
    description: "Register and confirm your attendance for the SRC 2026 conference events at KFUPM.",
  },
  // No SRC/KFUPM/AIChE keywords here, unlike every entry above: this page is
  // noindex'd and there is nothing to be gained from it ranking for anything.
  registrants: {
    title: "Registrant Export",
    description: "Internal page for the SRC 2026 organising team.",
  },
};

export function sectionToPath(section: Section): string {
  return SECTION_PATHS[section] ?? "/";
}

/** Resolve a pathname to a Section, or null when the URL matches no page. */
export function pathToSection(pathname: string): Section | null {
  // tolerate trailing slashes: /faq/ and /faq are the same page
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PATH_TO_SECTION.get(clean || "/") ?? null;
}
console.log("🔥 SECTION_PATHS keys:", Object.keys(SECTION_PATHS));
console.log("🔥 SECTION_PATHS.attendance:", SECTION_PATHS.attendance);