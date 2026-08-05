import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
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

  const registrationPromise = (async () => {
    // التسجيل الحالي (كما هو)
    const registration = await addDoc(
      collection(db, "registrations"),
      docData
    );

    // إضافة المستخدم إلى Collection users إذا لم يكن موجودًا
    const email = cleanData.email?.trim().toLowerCase();
    const fullName = cleanData.fullName?.trim();

    if (email && fullName) {
      const existingUser = await getDocs(
        query(
          collection(db, "users"),
          where("email", "==", email)
        )
      );

      if (existingUser.empty) {
        await addDoc(collection(db, "users"), {
          fullName,
          email,
          createdAt: serverTimestamp(),
        });
      }
    }

    return registration;
  })();

  return Promise.race([
    registrationPromise,
    timeout,
  ]);
}