// src/lib/users.ts
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight, Firestore-only "login" helpers.
// No Firebase Auth, no passwords, no email verification.
//
// Collection: users
//   { fullName: string, email: string, createdAt: Timestamp }
//
// This module deliberately does NOT initialise Firebase itself — it reuses the
// app instance already created by ./firebase (side-effect import below), so the
// existing `registrations` flow is completely untouched.
// ─────────────────────────────────────────────────────────────────────────────

import "./firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export type AppUser = {
  id: string;
  fullName: string;
  email: string;
};

// Resolved lazily so the default app from ./firebase is guaranteed to exist.
const usersCollection = () => collection(getFirestore(), "users");

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Look a user up by email. Returns null when no document matches.
 * Emails are stored lowercase; a raw-case fallback query keeps any
 * manually-added documents findable too.
 */
export async function findUserByEmail(email: string): Promise<AppUser | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const toAppUser = (docSnap: { id: string; data: () => Record<string, unknown> }): AppUser => {
    const data = docSnap.data() as { fullName?: string; email?: string };
    return {
      id: docSnap.id,
      fullName: (data.fullName ?? "").toString(),
      email: (data.email ?? normalized).toString(),
    };
  };

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
  email: string
): Promise<AppUser | null> {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const existing = await findUserByEmail(normalized);
  if (existing) return existing;

  const name = (fullName ?? "").trim();
  const ref = await addDoc(usersCollection(), {
    fullName: name,
    email: normalized,
    createdAt: serverTimestamp(),
  });

  return { id: ref.id, fullName: name, email: normalized };
}