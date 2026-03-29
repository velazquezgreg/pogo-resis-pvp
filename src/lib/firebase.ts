import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyBHyiG7XIJKgoBBn2WHhQNCxaEGXxKly54",
  authDomain: "pogo-resis-pvp.firebaseapp.com",
  projectId: "pogo-resis-pvp",
  storageBucket: "pogo-resis-pvp.firebasestorage.app",
  messagingSenderId: "316562087355",
  appId: "1:316562087355:web:fd1c3287eb79ef6925789e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);