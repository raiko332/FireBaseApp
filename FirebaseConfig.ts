import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// GANTI DENGAN KONFIGURASI ANDA DARI FIREBASE!
const firebaseConfig = {
  apiKey: "AIzaSyCy2PjXpUZ6wK0o_VNwGLZLFp01BMbYa20",
  authDomain: "konesi-firebase.firebaseapp.com",
  projectId: "konesi-firebase",
  storageBucket: "konesi-firebase.firebasestorage.app",
  messagingSenderId: "753178013929",
  appId: "1:753178013929:web:c4dc35b9ce195b6b0b4078"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);