import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCoSKAFBmdAvP_ZQGKW8svD-BuFue45xDc",
  authDomain: "dipression-tester.firebaseapp.com",
  projectId: "dipression-tester",
  storageBucket: "dipression-tester.appspot.com",
  messagingSenderId: "886914973496",
  appId: "1:886914973496:web:56d3ce38d8ea48de8e4bcd",
  measurementId: "G-8QL3X2CK3K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; 