import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

export type LoginUser = {
  id: string;
  fullName: string;
  email: string;
};

export async function loginWithEmail(email: string) {
  const q = query(
    collection(db, "users"),
    where("email", "==", email.trim().toLowerCase())
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...(doc.data() as Omit<LoginUser, "id">),
  };
}