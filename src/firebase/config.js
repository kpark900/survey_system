import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCCoPi2sLB5KFRPBymvpSfZDAv-1mIas64",
  authDomain: "surveysystem-5d037.firebaseapp.com",
  projectId: "surveysystem-5d037",
  storageBucket: "surveysystem-5d037.firebasestorage.app",
  messagingSenderId: "731648448200",
  appId: "1:731648448200:web:7b25f6c2a336e9040ff7fd",
  measurementId: "G-WWTNPLR8TW"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
