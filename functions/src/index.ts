import * as functions from "firebase-functions";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

initializeApp();

const db = getFirestore();

exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  const customClaims = {
    role: "user",
  };

  if (user.email && user.email === "mukai@daimaru-hakui.co.jp") {
    customClaims.role = "admin";
  } else if (user.email && user.email.endsWith("@daimaru-hakui.co.jp")) {
    customClaims.role = "member";
  } else {
    customClaims.role = "user";
  }

  try {
    await getAuth().setCustomUserClaims(user.uid, customClaims);
    const userRef = db.doc(`users/${user.uid}`);
    await userRef.set({
      createdAt: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
      email: user.email,
    });
  } catch (error) {
    console.log(error);
  }
});
