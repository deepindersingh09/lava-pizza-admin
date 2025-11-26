import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration (use the same config as your main app)
const firebaseConfig = {
  apiKey: "AIzaSyD5AevqcU5AfLqQ1QV6AjQMStDDfd0TeBk",
  authDomain: "lava-pizza.firebaseapp.com",
  projectId: "lava-pizza",
  storageBucket: "lava-pizza.firebasestorage.app",
  messagingSenderId: "898725473422",
  appId: "1:898725473422:web:493925b270a984f1396ddf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
