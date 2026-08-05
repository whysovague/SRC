// ─── Shared types ─────────────────────────────────────────────────────────────
// Kept free of imports so that any module (pages, components, data files) can
// depend on it without risking an import cycle.

/** A page in the app. `App` swaps pages off this value — there is no router. */
export type Section =
  | "home" | "about" | "competitions"
  | "agenda"
  | "partnership"
  | "faq" | "contact";

/** Which track a visitor registers under in the registration modal. */
export type RegType = "participant" | "team" | "speaker" | "volunteer" | "partner" | null;

/** A competition a team can register for. */
export type Competition =
  | "chem-e-car"
  | "cheme-jeopardy"
  | "technical-presentation"
  | "poster-competition"
  | null;
