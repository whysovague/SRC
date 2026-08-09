// src/lib/users.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight, Firestore-only "login" helpers.
// No Firebase Auth, no passwords, no email verification.
//
// Collection: users
//   { fullName: string, email: string, createdAt: Timestamp,
//     profileToken: string, profileComplete: boolean,
//     photoDataUrl?: string, profileUpdatedAt?: Timestamp }
//
// `profileToken` is an unguessable random string minted when the user document
// is created. It is emailed to the registrant as part of their "complete your
// profile" link and is the only credential that page accepts. Treat it as a
// bearer token: whoever holds the link can edit that one profile.
//
// This module deliberately does NOT initialise Firebase itself — it reuses the
// app instance already created by ./firebase (side-effect import below), so the
// existing `registrations` flow is completely untouched.
// ─────────────────────────────────────────────────────────────────────────────

import "./firebase";
import { withTimeout } from "./async";
import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export type AppUser = {
  id: string;
  fullName: string;
  email: string;
  /** Credential for the profile page. Absent on documents created before this
   *  feature shipped — call ensureProfileToken to backfill one. */
  profileToken?: string;
  /** True once the registrant has confirmed their badge name. */
  profileComplete?: boolean;
  /** Badge photo as a `data:image/jpeg;base64,…` string. Optional by design. */
  photoDataUrl?: string;
};

// Resolved lazily so the default app from ./firebase is guaranteed to exist.
const usersCollection = () => collection(getFirestore(), "users");

/** Firestore write promises never reject while offline — they queue silently —
 *  so every write a user is waiting on gets a deadline. */
const WRITE_TIMEOUT_MS = 10_000;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * 32 hex characters from the platform CSPRNG — ~128 bits, not guessable.
 * Falls back to Math.random only in environments without crypto, which no
 * browser we support actually is.
 */
export function generateProfileToken(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

const toAppUser = (docSnap: { id: string; data: () => Record<string, unknown> }): AppUser => {
  const data = docSnap.data() as {
    fullName?: string;
    email?: string;
    profileToken?: string;
    profileComplete?: boolean;
    photoDataUrl?: string;
  };
  return {
    id: docSnap.id,
    fullName: (data.fullName ?? "").toString(),
    email: (data.email ?? "").toString(),
    profileToken: data.profileToken,
    profileComplete: Boolean(data.profileComplete),
    photoDataUrl: data.photoDataUrl,
  };
};

/**
 * Look a user up by email. Returns null when no document matches.
 * Emails are stored lowercase; a raw-case fallback query keeps any
 * manually-added documents findable too.
 */
export async function findUserByEmail(email: string): Promise<AppUser | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const primary = await getDocs(
    query(usersCollection(), where("email", "==", normalized), limit(1))
  );
  if (!primary.empty) return toAppUser(primary.docs[0]);

  const raw = email.trim();
  if (raw && raw !== normalized) {
    const fallback = await getDocs(
      query(usersCollection(), where("email", "==", raw), limit(1))
    );
    if (!fallback.empty) return toAppUser(fallback.docs[0]);
  }

  return null;
}

/**
 * Look a user up by the token from their confirmation-email link.
 * Returns null for an unknown, empty or expired-looking token.
 */
export async function findUserByToken(token: string): Promise<AppUser | null> {
  const clean = token.trim();
  if (!clean) return null;

  const snap = await withTimeout(
    getDocs(query(usersCollection(), where("profileToken", "==", clean), limit(1))),
    WRITE_TIMEOUT_MS
  );
  return snap.empty ? null : toAppUser(snap.docs[0]);
}

/**
 * Create a `users` document only if the email isn't already present.
 * Never duplicates a user. Returns the existing or newly created record,
 * always carrying a profileToken.
 */
export async function createUserIfNotExists(
  fullName: string,
  email: string
): Promise<AppUser | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  // Pass the raw string, not `normalized`: findUserByEmail normalises
  // internally and only runs its raw-case fallback query when the two differ.
  // Handing it the already-lowercased value would make that fallback dead code
  // and let a manually-added document with a mixed-case email slip through,
  // producing a duplicate user.
  const existing = await findUserByEmail(email);
  if (existing) return backfillExisting(existing, fullName);

  const name = (fullName ?? "").trim();
  const profileToken = generateProfileToken();

  const ref = await withTimeout(
    addDoc(usersCollection(), {
      fullName: name,
      email: normalized,
      profileToken,
      profileComplete: false,
      createdAt: serverTimestamp(),
    }),
    WRITE_TIMEOUT_MS
  );

  return { id: ref.id, fullName: name, email: normalized, profileToken, profileComplete: false };
}

/**
 * Give a pre-existing user document a profileToken if it lacks one, so people
 * who registered before this feature shipped can still be sent a working link.
 */
export async function ensureProfileToken(user: AppUser): Promise<AppUser> {
  if (user.profileToken) return user;

  const profileToken = generateProfileToken();
  await withTimeout(updateDoc(doc(usersCollection(), user.id), { profileToken }), WRITE_TIMEOUT_MS);
  return { ...user, profileToken };
}

/**
 * Bring an already-existing user document up to date on a repeat registration:
 * mint a token if it has none, and fill in a name if it has none.
 *
 * A name that is already set is deliberately left alone — the registrant may
 * have edited it on the profile page, and that is the spelling they want on
 * their badge.
 */
async function backfillExisting(user: AppUser, fullName: string): Promise<AppUser> {
  const name = (fullName ?? "").trim();
  const needsToken = !user.profileToken;
  const needsName = !user.fullName.trim() && name !== "";

  if (!needsToken && !needsName) return user;

  const patch: Record<string, unknown> = {};
  const profileToken = needsToken ? generateProfileToken() : user.profileToken;
  if (needsToken) patch.profileToken = profileToken;
  if (needsName) patch.fullName = name;

  await withTimeout(updateDoc(doc(usersCollection(), user.id), patch), WRITE_TIMEOUT_MS);

  return {
    ...user,
    profileToken,
    fullName: needsName ? name : user.fullName,
  };
}

/**
 * Save the badge details collected on the profile page.
 * `photoDataUrl` is optional; pass null to clear an existing photo.
 */
export async function saveProfile(
  userId: string,
  fields: { fullName: string; photoDataUrl?: string | null }
): Promise<void> {
  const patch: Record<string, unknown> = {
    fullName: fields.fullName.trim(),
    profileComplete: true,
    profileUpdatedAt: serverTimestamp(),
  };

  // undefined means "leave whatever is there"; null means "remove it".
  if (fields.photoDataUrl !== undefined) {
    patch.photoDataUrl = fields.photoDataUrl ?? "";
  }

  await withTimeout(updateDoc(doc(usersCollection(), userId), patch), WRITE_TIMEOUT_MS);
}
