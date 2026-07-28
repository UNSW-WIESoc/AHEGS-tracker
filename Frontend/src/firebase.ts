import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJeRkqY9tExPbBMbFYUgHKOoy3JEZo4PY",
  authDomain: "ahegs-tracker-3038a.firebaseapp.com",
  projectId: "ahegs-tracker-3038a",
  storageBucket: "ahegs-tracker-3038a.firebasestorage.app",
  messagingSenderId: "288607122335",
  appId: "1:288607122335:web:f531e10ea6c820843a83aa",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);