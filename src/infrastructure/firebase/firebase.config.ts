import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyBjcV4BykdV3boinmn_-LQZ4IHgTqUwKvw",
  authDomain: "bubble-2d982.firebaseapp.com",
  projectId: "bubble-2d982",
  storageBucket: "bubble-2d982.appspot.com",
  messagingSenderId: "680561170660",
  appId: "1:680561170660:web:64598540804f465c7274f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, firestore };
export default app;