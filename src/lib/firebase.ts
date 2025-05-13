
// This file is kept for backwards compatibility
// The application now uses MySQL for file storage instead of Firebase

// If you need to access the old Firebase API, you can uncomment the code below
// However, all components should now be using the MySQL API

/*
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxN3B8IlP4Byw_zqNoo7wIIRrV_3KfNxU",
  authDomain: "ahjbu-com.firebaseapp.com",
  projectId: "ahjbu-com",
  storageBucket: "ahjbu-com.firebasestorage.app",
  messagingSenderId: "911158844467",
  appId: "1:911158844467:web:23f87ee44f83e0c4f11746",
  measurementId: "G-FJG1G1LCYS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
*/

// Export a dummy storage object to prevent breaking existing code
export const storage = null;

// Log a warning if this file is imported
console.warn("Firebase is deprecated in this project. Please use MySQL services instead.");
