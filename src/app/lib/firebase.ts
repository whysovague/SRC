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

// Fail fast during development if environment variables aren't bound
if (!firebaseConfig.projectId) {
  console.error(
    "Firebase Initialization Error: VITE_FIREBASE_PROJECT_ID is missing from environment variables."
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

// Firebase Authentication
export const auth = getAuth(app);

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