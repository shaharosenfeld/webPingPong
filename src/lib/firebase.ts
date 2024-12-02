import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDExrNXtbVDQZ3W2-QKpxiznJsUqB_sQLI",
  authDomain: "ping-pong-league-61139.firebaseapp.com",
  projectId: "ping-pong-league-61139",
  storageBucket: "ping-pong-league-61139.appspot.com",
  messagingSenderId: "384030425532",
  appId: "1:384030425532:web:64e7e2bb88e8ffda36c668"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);