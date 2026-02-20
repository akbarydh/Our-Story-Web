import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQuFOWC9KbN4da6UX2Z-95xHnXUsWi1iU",
  authDomain: "our-story-f3e01.firebaseapp.com",
  projectId: "our-story-f3e01",
  storageBucket: "our-story-f3e01.firebasestorage.app",
  messagingSenderId: "902162097990",
  appId: "1:902162097990:web:c0979ce47bfbd020cd2747",
  measurementId: "G-WNNQ7VD4NB"
};

// Inisialisasi Firebase (biar nggak error pas save/reload)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };