// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBnldbJc01v2fK1sHEahIOTDjB_W62O7Vc",
    authDomain: "acessibus-prototipo.firebaseapp.com",
    databaseURL: "https://acessibus-prototipo-default-rtdb.firebaseio.com",
    projectId: "acessibus-prototipo",
    storageBucket: "acessibus-prototipo.appspot.com", // ✅ CORRIGIDO
    messagingSenderId: "458795142376",
    appId: "1:458795142376:web:afb1b1d45e5a9337dccd5d",
    measurementId: "G-5CMB8ENREW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
