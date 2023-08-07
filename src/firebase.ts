// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "pg-timesheet.firebaseapp.com",
  databaseURL:
    "https://pg-timesheet-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pg-timesheet",
  storageBucket: "pg-timesheet.appspot.com",
  messagingSenderId: "672619049815",
  appId: "1:672619049815:web:91c825d5d465254e528412",
  measurementId: "G-8DWHFSZQBF",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
