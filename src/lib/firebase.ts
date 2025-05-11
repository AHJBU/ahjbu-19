
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyzr7XmUZhLz9aMnJXB7TyQ8MBKpGfhrk",
  authDomain: "lovable-media-center.firebaseapp.com",
  projectId: "lovable-media-center",
  storageBucket: "lovable-media-center.appspot.com",
  messagingSenderId: "463025308278",
  appId: "1:463025308278:web:62d3e7d5f070946e6f039c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
