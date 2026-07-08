import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export type RegistrationPayload = {
  type: "participant" | "team" | "speaker" | "volunteer" | "partner";
  competition: string | null;
  data: Record<string, string>;
};

export async function submitRegistration(payload: RegistrationPayload) {
  return addDoc(collection(db, "registrations"), {
    ...payload,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
