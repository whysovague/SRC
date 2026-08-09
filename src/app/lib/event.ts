// ─── Event facts ──────────────────────────────────────────────────────────────
// Single source of truth for the conference details that appear in the
// confirmation email and on the profile page. Change a date here and both
// follow — do not retype these strings anywhere else.
//
// Note: the countdown on the home page keeps its own EVENT_START constant
// (components/hero/CountdownTimer.tsx). If the dates move, update both.

export const EVENT = {
  name: "SRC 2026",
  fullName: "AIChE Student Regional Conference 2026",

  /** Human-readable range, used verbatim in the email. */
  dates: "31 August – 2 September 2026",
  datesShort: "Aug 31 – Sep 2, 2026",

  /** Day one, first session. Matches EVENT_START in CountdownTimer.tsx. */
  doorsOpen: "8:30 AM (AST), Monday 31 August",

  venue: "King Fahd University of Petroleum & Minerals",
  venueShort: "KFUPM",
  city: "Dhahran, Saudi Arabia",

  supportEmail: "aiche@kfupm.edu.sa",
} as const;

/** "KFUPM, Dhahran, Saudi Arabia" — the one-line location used in the email. */
export const EVENT_LOCATION = `${EVENT.venueShort}, ${EVENT.city}`;
