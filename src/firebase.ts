import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration (요구사항 제공 값)
export const firebaseConfig = {
  apiKey: "AIzaSyCIZ9I6VK1fKyNcmny0-mGwmgfaVEmwS5o",
  authDomain: "appp-7e331.firebaseapp.com",
  projectId: "appp-7e331",
  storageBucket: "appp-7e331.firebasestorage.app",
  messagingSenderId: "325117829992",
  appId: "1:325117829992:web:e1fae257b9edb07abeacdd",
  measurementId: "G-VD8F88LC24"
};

export const app = initializeApp(firebaseConfig);
// Analytics는 로컬 개발(HTTP)에서는 동작하지 않을 수 있습니다.
export const analytics = (() => { try { return getAnalytics(app); } catch { return undefined; } })();

export const db = getFirestore(app);
export const storage = getStorage(app);
