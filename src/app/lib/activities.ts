// ─── Activity sign-ups ────────────────────────────────────────────────────────
// Separate from `registrations`, which is conference registration. Signing up
// for an activity assumes the person is already registered, so nothing personal
// is collected here — only which activity, and an optional question for the
// speakers.
//
// The document ID is derived from the email and the activity, which is what
// makes this idempotent: signing up twice writes the same document instead of
// creating a second one. That is the fix for the duplicate records a repeat
// registration used to leave behind.

import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import { withTimeout } from "./async";

export type ActivityId = "intro-to-che" | "fresh-vs-experienced" | "women-in-stem";

/** Titles live here so the stored record is readable without a join. */
export const ACTIVITIES: Record<ActivityId, string> = {
  "intro-to-che": "Intro to ChE",
  "fresh-vs-experienced": "Fresh vs Experienced",
  "women-in-stem": "Women in STEM",
};

export type ActivitySignup = {
  activityId: ActivityId;
  activityTitle: string;
  email: string;
  fullName: string;
  /** Optional — a question the attendee wants put to the speakers. */
  question?: string;
};

const TIMEOUT_MS = 10_000;
export const MAX_QUESTION_CHARS = 500;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Firestore document IDs may not contain `/` and may not be `.` or `..`.
 * An email address contains neither, so `email__activity` is safe as-is.
 */
export function signupDocId(email: string, activityId: ActivityId): string {
  return `${normalizeEmail(email)}__${activityId}`;
}

const signupRef = (email: string, activityId: ActivityId) =>
  doc(getFirestore(), "activitySignups", signupDocId(email, activityId));

/**
 * Has this person already signed up? Reads one document by its exact ID —
 * the rules deny listing the collection, so this cannot be used to enumerate
 * anyone else's sign-ups.
 *
 * Never throws: a failed check just means the card shows its default state.
 */
export async function hasSignedUp(email: string, activityId: ActivityId): Promise<boolean> {
  if (!normalizeEmail(email)) return false;
  try {
    const snap = await withTimeout(getDoc(signupRef(email, activityId)), TIMEOUT_MS);
    return snap.exists();
  } catch (e) {
    console.error("Activity sign-up check failed:", e);
    return false;
  }
}

/** Check several activities at once. Failures resolve to false, never reject. */
export async function getSignedUpSet(
  email: string,
  activityIds: readonly ActivityId[]
): Promise<Set<ActivityId>> {
  const results = await Promise.all(
    activityIds.map(async (id) => [id, await hasSignedUp(email, id)] as const)
  );
  return new Set(results.filter(([, yes]) => yes).map(([id]) => id));
}

/**
 * Record a sign-up. `setDoc` with a derived ID means a repeat call updates the
 * same document — the person can revise their question without creating a
 * duplicate. Throws on failure so the dialog can show a real error.
 */
export async function saveActivitySignup(input: {
  email: string;
  fullName: string;
  activityId: ActivityId;
  question?: string;
}): Promise<void> {
  const email = normalizeEmail(input.email);
  if (!email) throw new Error("Missing email.");

  const question = (input.question ?? "").trim().slice(0, MAX_QUESTION_CHARS);

  await withTimeout(
    setDoc(
      signupRef(email, input.activityId),
      {
        activityId: input.activityId,
        activityTitle: ACTIVITIES[input.activityId],
        email,
        fullName: input.fullName.trim(),
        question,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    ),
    TIMEOUT_MS
  );
}
