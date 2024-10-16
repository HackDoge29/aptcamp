// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1J6fXXnD-jR3nSPVHdUkQnt9NTfDYpns",
  authDomain: "fancamp436326.firebaseapp.com",
  projectId: "fancamp436326",
  storageBucket: "fancamp436326.appspot.com",
  messagingSenderId: "1040066115816",
  appId: "1:1040066115816:web:99c6b4061022465536715d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
