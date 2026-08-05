// ─── Brand constants ──────────────────────────────────────────────────────────
// Single source of truth for the SRC 2026 palette. Imported by every page and
// shared component — do not redeclare these values locally.

export const TEAL = "#0CBFCE";
export const ORANGE = "#E87C2A";

// Palette accents for section-header gradient (light blue → orange)
export const PALETTE_BLUE = "#4c90c1";
export const PALETTE_ORANGE = "#e47d1b";

// Comma-separated RGB triples — used inside rgba() strings on the canvas
// animations (MoleculeNetwork, MolecularOrbit), where hex is not convenient.
export const ORBIT_CYAN = "12,191,206";
export const ORBIT_ORANGE = "232,124,42";
export const ORBIT_WHITE = "255,255,255";
