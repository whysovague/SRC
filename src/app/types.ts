// ─── Shared types ─────────────────────────────────────────────────────────────
// Kept free of imports so that any module (pages, components, data files) can
// depend on it without risking an import cycle.

/** A page in the app. Each Section maps to a URL in routes.ts; App derives the
 *  current Section from the address bar and navigates when it is set. */
export type Section =
  | "home" | "competitions"
  | "agenda"
  | "partnership"
  | "faq" | "contact"
  | "attendance"
  | "registrants"

/** Which track a visitor registers under in the registration modal. */
export type RegType = "participant" | "team" | "speaker" | "volunteer" | "partner" | null;

/** A competition a team can register for. */
export type Competition =
  | "chem-e-car"
  | "cheme-jeopardy"
  | "technical-presentation"
  | "poster-competition"
  | null;
