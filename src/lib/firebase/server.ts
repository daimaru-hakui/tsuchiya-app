import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string;
export const firebaseAdmin =
  getApps()[0] ??
  initializeApp({
    credential: cert(
      JSON.parse(serviceAccount)
      // serviceAccount
      // {
      //   projectId: process.env.FIREBASE_PROJECT_ID,
      //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      // }
    ),
  });

export const auth = getAuth(firebaseAdmin);
export const db = getFirestore(firebaseAdmin);
