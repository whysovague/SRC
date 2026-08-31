// ─── Workshop registrations ───────────────────────────────────────────────────
// Deliberately separate from three neighbouring things it could be confused
// with:
//
//   `activitySignups`  — sign-ups for talks, which assume the person already
//                        holds a conference registration and so collect no
//                        personal details. Its rules deny `list` outright to
//                        protect the questions people submit, which is exactly
//                        why the workshop counts could not live there: the
//                        export page has to be able to count them.
//   `registrations`    — conference registration itself.
//   `tabaqatWorkshop`  — *attendance* on the day, written from /attend. Signing
//                        up in advance and turning up are different facts and
//                        must not share a collection, or the roster stops
//                        meaning anything.
//
// One collection with a `workshopId` field rather than one collection per
// workshop: adding a third workshop then needs no new Firestore rule.
//
// The document ID is `email__workshopId`, which is what makes this idempotent —
// registering twice rewrites the same document instead of inflating the count.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { withTimeout } from "./async";

export type WorkshopId = "career-workshop" | "tabaqat-3d-printing";

/** Titles live here so a stored record is readable without a join. */
export const WORKSHOPS: Record<WorkshopId, string> = {
  "career-workshop": "Career Workshop",
  "tabaqat-3d-printing": "Tabaqat 3D Printing Workshop",
};

export type WorkshopSession = { id: string; label: string };

/**
 * Workshops that run more than once: the registrant picks which sitting they
 * are coming to, and the choice is stored on their record so the organisers
 * know how many to expect on each day.
 *
 * An empty list means the workshop runs once and the form skips the question
 * entirely — no pointless single-option picker.
 */
export const WORKSHOP_SESSIONS: Record<WorkshopId, WorkshopSession[]> = {
  "career-workshop": [],
  "tabaqat-3d-printing": [
    { id: "day-1", label: "Day 1 · 5:10 – 6:10 pm" },
    { id: "day-3", label: "Day 3 · 4:00 – 5:00 pm" },
  ],
};

export type WorkshopSignup = {
  workshopId: WorkshopId;
  workshopTitle: string;
  fullName: string;
  email: string;
  /** "" for a workshop that runs only once. */
  sessionLabel: string;
  /** "YYYY-MM-DD HH:MM" in the reader's local time, or "" if the record has no
   *  timestamp. Deliberately not an ISO string: `toISOString()` is UTC, which
   *  would have this export three hours behind the registrant export beside it
   *  on the same page. Zero-padded throughout, so sorting the text sorts it
   *  chronologically too. */
  createdAt: string;
};

/** Matches the formatting used by the registrant export, so both CSVs
 *  downloaded from that page agree on what time something happened. */
function formatLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

const COLLECTION = "workshopSignups";
const TIMEOUT_MS = 10_000;

export const MAX_NAME_CHARS = 120;
export const MAX_EMAIL_CHARS = 254;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/** Deliberately permissive — enough to catch a typo, not to police addresses. */
export function isValidEmail(email: string): boolean {
  const e = normalizeEmail(email);
  return e.length > 0 && e.length <= MAX_EMAIL_CHARS && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

/** Firestore IDs may not contain `/` nor be `.`/`..`; an email is neither. */
export function workshopDocId(email: string, workshopId: WorkshopId): string {
  return `${normalizeEmail(email)}__${workshopId}`;
}

const signupRef = (email: string, workshopId: WorkshopId) =>
  doc(getFirestore(), COLLECTION, workshopDocId(email, workshopId));

/**
 * Record a registration. `setDoc` on a derived ID means a repeat submission
 * corrects the existing record rather than adding a second one. Throws on
 * failure so the form can show a real error instead of a false success.
 */
export async function saveWorkshopSignup(input: {
  workshopId: WorkshopId;
  fullName: string;
  email: string;
  /** Required when the workshop has sessions; ignored when it does not. */
  sessionId?: string;
}): Promise<void> {
  const email = normalizeEmail(input.email);
  const fullName = input.fullName.trim().slice(0, MAX_NAME_CHARS);

  if (!isValidEmail(email)) throw new Error("Please enter a valid email address.");
  if (fullName.length < 2) throw new Error("Please enter your full name.");

  const sessions = WORKSHOP_SESSIONS[input.workshopId];
  const session = sessions.find((s) => s.id === input.sessionId);
  if (sessions.length > 0 && !session) throw new Error("Please choose a day.");

  await withTimeout(
    setDoc(
      signupRef(email, input.workshopId),
      {
        workshopId: input.workshopId,
        workshopTitle: WORKSHOPS[input.workshopId],
        fullName,
        email,
        // Stored flat rather than as an ID alone, so the export is readable
        // without having to look the session up in the code.
        sessionId: session?.id ?? "",
        sessionLabel: session?.label ?? "",
        createdAt: serverTimestamp(),
      },
      { merge: true }
    ),
    TIMEOUT_MS
  );
}

/**
 * Has this person already registered? Reads one document by its exact ID.
 * Never throws — a failed check just leaves the card in its default state.
 */
export async function hasWorkshopSignup(email: string, workshopId: WorkshopId): Promise<boolean> {
  if (!normalizeEmail(email)) return false;
  try {
    const snap = await withTimeout(getDoc(signupRef(email, workshopId)), TIMEOUT_MS);
    return snap.exists();
  } catch (e) {
    console.error("Workshop registration check failed:", e);
    return false;
  }
}

/**
 * Every registration, grouped by workshop — for the organisers' export page.
 * Reads the whole collection, so call it once per page load, not per card.
 */
export async function getAllWorkshopSignups(): Promise<Record<WorkshopId, WorkshopSignup[]>> {
  const out: Record<WorkshopId, WorkshopSignup[]> = {
    "career-workshop": [],
    "tabaqat-3d-printing": [],
  };

  // A longer budget than the single-document helpers above: this reads the
  // whole collection, and on a phone it may be queued behind other traffic.
  const snap = await withTimeout(getDocs(collection(getFirestore(), COLLECTION)), 30_000);

  snap.forEach((d) => {
    const v = d.data() as Record<string, unknown>;
    const id = v.workshopId as WorkshopId;
    if (!out[id]) return; // a workshop that has since been removed from the app

    const ts = v.createdAt as { toDate?: () => Date } | undefined;
    out[id].push({
      workshopId: id,
      workshopTitle: String(v.workshopTitle ?? WORKSHOPS[id] ?? ""),
      fullName: String(v.fullName ?? "").trim(),
      email: String(v.email ?? "").trim(),
      sessionLabel: String(v.sessionLabel ?? ""),
      createdAt: ts?.toDate ? formatLocal(ts.toDate()) : "",
    });
  });

  // Oldest first, so the export reads as a sign-up sheet in order.
  for (const id of Object.keys(out) as WorkshopId[]) {
    out[id].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  return out;
}
