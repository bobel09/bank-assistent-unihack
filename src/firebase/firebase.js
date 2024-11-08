import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {signInWithPopup} from "firebase/auth";
import {getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA-uyFhCC4TOEst_uB9et3Oi6sB3Fv4xJE",
    authDomain: "bank-assistent-1dea1.firebaseapp.com",
    projectId: "bank-assistent-1dea1",
    storageBucket: "bank-assistent-1dea1.firebasestorage.app",
    messagingSenderId: "232402832863",
    appId: "1:232402832863:web:bc98310aa847029ddc886a",
    measurementId: "G-E902J7HY4E"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {app,auth, signInWithPopup, db};