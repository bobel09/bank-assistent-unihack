import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {signInWithPopup} from "firebase/auth";
import {getFirestore } from "firebase/firestore";
import { setPersistence, browserLocalPersistence } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCajPbY8B-kt7RWurcuhrkZEU5kOtnptKI",
  authDomain: "movie-site-c5ae8.firebaseapp.com",
  projectId: "movie-site-c5ae8",
  storageBucket: "movie-site-c5ae8.firebasestorage.app",
  messagingSenderId: "13402152154",
  appId: "1:13402152154:web:e29c37025a37e6883a19e3",
  measurementId: "G-XFZC3VQQXR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export {app,auth, signInWithPopup, db};