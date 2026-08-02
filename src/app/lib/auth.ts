import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./firebase";

/**
 * Register
 */
export async function registerUser(
  fullName: string,
  email: string,
  password: string
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(credential.user, {
    displayName: fullName,
  });

  await credential.user.reload();

  return credential.user;
}

/**
 * Login
 */
export async function loginUser(
  email: string,
  password: string
) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}

/**
 * Logout
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Forgot Password
 */
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Current User
 */
export function getCurrentUser() {
  return auth.currentUser;
}