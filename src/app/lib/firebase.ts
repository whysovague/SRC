import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Warn during development if environment variables aren't bound.
// IMPORTANT: never throw at module scope — that would blank the whole site.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase is not configured: missing VITE_FIREBASE_* environment variables " +
    "(create a .env file — see .env.example). The site will render, but " +
    "registration and login will not work until they are set."
  );
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore
let dbInstance;

try {
  dbInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch (e) {
  dbInstance = getFirestore(app);
}

export const db = dbInstance;

// Firebase Authentication — getAuth() throws on a missing/invalid API key, so
// guard it: without config the site still renders and only auth calls fail.
export const auth = (() => {
  try {
    return getAuth(app);
  } catch (e) {
    console.error("Firebase Auth unavailable (invalid or missing API key):", e);
    return null as unknown as ReturnType<typeof getAuth>;
  }
})();

export type RegistrationPayload = {
  type: "participant" | "team" | "speaker" | "volunteer" | "partner";
  competition: string | null;
  data: Record<string, string>;
};

export async function submitRegistration(payload: RegistrationPayload) {
  const cleanData: Record<string, string> = {};

  Object.entries(payload.data || {}).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      cleanData[key] = String(val);
    }
  });

  const docData: Record<string, any> = {
    type: payload.type,
    data: cleanData,
    status: "pending",
    createdAt: serverTimestamp(),
  };

  if (payload.competition) {
    docData.competition = payload.competition;
  }

  const timeout = new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            "Request timed out — check your network or ad blocker."
          )
        ),
      10000
    )
  );

  // التسجيل الحالي (كما هو)
  //
  // This used to also create the matching `users` document. That is now done
  // by createUserIfNotExists in lib/users.ts, which the registration modal
  // calls straight after this resolves — one owner for the collection.
  //
  // The duplicate was actively harmful: it wrote a bare user document that the
  // very next call then had to find and patch, and it skipped partner and team
  // registrations, whose name lives in contactPerson / teamName rather than
  // fullName — so those people never got a users row at all.
  const registrationPromise = addDoc(collection(db, "registrations"), docData);

  return Promise.race([
    registrationPromise,
    timeout,
  ]);
}