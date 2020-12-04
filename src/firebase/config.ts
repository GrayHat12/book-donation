//import * as firebase from "firebase/app"
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCwH-3komxDQcnAtm4bA5U0ssmmDNeB06w",//process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "book-donation-app-e0954.firebaseapp.com",//process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: "https://book-donation-app-e0954-default-rtdb.firebaseio.com/",//process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: "book-donation-app-e0954",//process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: "book-donation-app-e0954.appspot.com",//process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: "320509347693",//process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: "1:320509347693:web:418290cfe2a791117dbc64",//process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: "G-M0T18ZP12L",//process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = firebase.initializeApp(firebaseConfig);


export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
export default app;