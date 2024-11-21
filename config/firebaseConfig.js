// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-interior-45e4a.firebaseapp.com",
  projectId: "ai-interior-45e4a",
  storageBucket: "ai-interior-45e4a.firebasestorage.app",
  messagingSenderId: "849085554391",
  appId: "1:849085554391:web:dd53a3d3d3828330ba9a92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app);