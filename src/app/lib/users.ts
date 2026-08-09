// src/lib/users.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight, Firestore-only "login" helpers.
// No Firebase Auth, no passwords, no email verification.
//
// Collection: users
//   { fullName: string, email: string, createdAt: Timestamp,
//     photoDataUrl?: string, profileUpdatedAt?: Timestamp }
//
// `photoDataUrl` is the badge photo the registrant optionally uploaded, stored
// inline as a base64 JPEG rather than in Cloud Storage (which needs the Blaze
// plan). lib/image.ts keeps it small enough for a Firestore document. It is
// kept after the badge is generated so the organising team can reuse it for
// printed badges at the desk.
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
  /** Badge photo as a `data:image/jpeg;base64,…` string. Optional by design. */
  photoDataUrl?: string;
};

// Resolved lazily so the default app from ./firebase is guaranteed to exist.
const usersCollection = () => collection(getFirestore(), "users");

/** Firestore write promises never reject while offline — they queue silently —
 *  so every write a user is waiting on gets a deadline. */
const WRITE_TIMEOUT_MS = 10_000;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toAppUser = (docSnap: { id: string; data: () => Record<string, unknown> }): AppUser => {
  const data = docSnap.data() as {
    fullName?: string;
    email?: string;
    photoDataUrl?: string;
  };
  return {
    id: docSnap.id,
    fullName: (data.fullName ?? "").toString(),
    email: (data.email ?? "").toString(),
    photoDataUrl: data.photoDataUrl || undefined,
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
 * Create a `users` document only if the email isn't already present.
 * Never duplicates a user. Returns the existing or newly created record.
 */
export async function createUserIfNotExists(
  fullName: string,
  email: string,
  photoDataUrl?: string | null
): Promise<AppUser | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  // Pass the raw string, not `normalized`: findUserByEmail normalises
  // internally and only runs its raw-case fallback query when the two differ.
  // Handing it the already-lowercased value would make that fallback dead code
  // and let a manually-added document with a mixed-case email slip through,
  // producing a duplicate user.
  const existing = await findUserByEmail(email);
  if (existing) return backfillExisting(existing, fullName, photoDataUrl);

  const name = (fullName ?? "").trim();
  const record: Record<string, unknown> = {
    fullName: name,
    email: normalized,
    createdAt: serverTimestamp(),
  };
  if (photoDataUrl) record.photoDataUrl = photoDataUrl;

  const ref = await withTimeout(addDoc(usersCollection(), record), WRITE_TIMEOUT_MS);

  return {
    id: ref.id,
    fullName: name,
    email: normalized,
    photoDataUrl: photoDataUrl || undefined,
  };
}

/**
 * Bring an existing user document up to date on a repeat registration:
 * fill in a name if it has none, and store a newly supplied photo.
 *
 * An existing name is deliberately left alone. A photo, by contrast, is
 * overwritten whenever a new one is supplied — re-registering with a new
 * headshot should update it, and leaving it blank should not wipe the old one.
 */
async function backfillExisting(
  user: AppUser,
  fullName: string,
  photoDataUrl?: string | null
): Promise<AppUser> {
  const name = (fullName ?? "").trim();
  const needsName = !user.fullName.trim() && name !== "";
  const needsPhoto = Boolean(photoDataUrl) && photoDataUrl !== user.photoDataUrl;

  if (!needsName && !needsPhoto) return user;

  const patch: Record<string, unknown> = { profileUpdatedAt: serverTimestamp() };
  if (needsName) patch.fullName = name;
  if (needsPhoto) patch.photoDataUrl = photoDataUrl;

  await withTimeout(updateDoc(doc(usersCollection(), user.id), patch), WRITE_TIMEOUT_MS);

  return {
    ...user,
    fullName: needsName ? name : user.fullName,
    photoDataUrl: needsPhoto ? photoDataUrl ?? undefined : user.photoDataUrl,
  };
}
