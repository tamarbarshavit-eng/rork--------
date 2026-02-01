// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVtOSqAealIR1xtzENibAUqjNNIPuNhZE",
  authDomain: "positivetalk-5d12d.firebaseapp.com",
  databaseURL: "https://positivetalk-5d12d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "positivetalk-5d12d",
  storageBucket: "positivetalk-5d12d.firebasestorage.app",
  messagingSenderId: "355686228410",
  appId: "1:355686228410:web:0f7160bdb768becbde3d83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app)
const db = getDatabase(app)

export default { auth, db}