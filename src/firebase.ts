import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ 추가

// Firebase config (user provided)
const firebaseConfig = {
  apiKey: "AIzaSyD0RipCKxAxvzWYcsI6GlUS2dtLmtU4MjU",
  authDomain: "soom-fd5d3.firebaseapp.com",
  projectId: "soom-fd5d3",
  storageBucket: "soom-fd5d3.firebasestorage.app",
  messagingSenderId: "559989538115",
  appId: "1:559989538115:web:07f9a3183d2920759283f6",
  measurementId: "G-9YSTNMM3X9",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ 추가

// Analytics (optional)
export async function initAnalytics() {
  try {
    const ok = await isSupported();
    if (ok) getAnalytics(app);
  } catch {
    // ignore
  }
}