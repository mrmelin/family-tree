import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCA75g9cOQVMeHRxYJ5GZBVyqxVKqQ07oQ",
  authDomain: "melin-cc995.firebaseapp.com",
  projectId: "melin-cc995",
  storageBucket: "melin-cc995.appspot.com",
  messagingSenderId: "493651335332",
  appId: "1:493651335332:web:b7aa6ccfad0e13e8496e31",
  databaseURL: "https://melin-cc995-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);