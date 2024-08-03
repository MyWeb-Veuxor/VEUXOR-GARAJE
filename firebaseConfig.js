
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuCVVrPKoS6JzbNqPHtKN74UTuH-EGXgY",
  authDomain: "garaje-veuxor.firebaseapp.com",
  projectId: "garaje-veuxor",
  storageBucket: "garaje-veuxor.appspot.com",
  messagingSenderId: "1052985816300",
  appId: "1:1052985816300:web:bfcc482b5dee7fa50da1c9",
  measurementId: "G-YEHBZFJP40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
