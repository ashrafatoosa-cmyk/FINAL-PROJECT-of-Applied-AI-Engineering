import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1fO-ML_nv8VrNwfexoxTusQlUbeJVAyc",
  authDomain: "movemate-pro-2026.firebaseapp.com",
  projectId: "movemate-pro-2026",
  storageBucket: "movemate-pro-2026.firebasestorage.app",
  messagingSenderId: "201270826850",
  appId: "1:201270826850:web:090aed870354ed5eddbe3b",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
