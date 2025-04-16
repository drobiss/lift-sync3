// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurace z tvého projektu
const firebaseConfig = {
  apiKey: "AIzaSyAjXb3WFRbC9o0Zo2kWhs0fKf88Oow_LNQ",
  authDomain: "liftsync-6b969.firebaseapp.com",
  projectId: "liftsync-6b969",
  storageBucket: "liftsync-6b969.firebasestorage.app",
  messagingSenderId: "875000053196",
  appId: "1:875000053196:web:3fd886f99e2d017714f169",
  measurementId: "G-GJQGY3E6HP"
};

// Inicializace Firebase appky
const app = initializeApp(firebaseConfig);

// Export služeb, které budeme používat
export const auth = getAuth(app);
export const db = getFirestore(app);
