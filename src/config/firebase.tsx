import {initializeApp} from 'firebase/app';
import {
    connectAuthEmulator,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from 'firebase/auth'; // Import necessary Firebase auth modules
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {getMessaging, getToken} from 'firebase/messaging';
import config from '../config';
import {addDoc, collection} from "firebase/firestore";
import {firestore} from "./firestore";

const firebaseConfig = {
    apiKey: config.VITE_BASE_FIREBASE_API_KEY,
    authDomain: config.VITE_BASE_FIREBASE_AUTH_DOMAIN,
    databaseURL: config.VITE_BASE_FIREBASE_DATABASE_URL,
    projectId: config.VITE_BASE_FIREBASE_PROJECT_ID,
    storageBucket: config.VITE_BASE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.VITE_BASE_FIREBASE_MESSAGING_SENDER_ID,
    appId: config.VITE_BASE_FIREBASE_APP_ID,
    measurementId: config.VITE_BASE_FIREBASE_MEASUREMENT_ID,
};

console.log(firebaseConfig);

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase); // Initialize Firebase Auth
const storage = getStorage(firebase); // Initialize Firebase Storage
// const messaging = getMessaging(firebase); // Initialize Firebase messaging

// Set the auth emulator
if (process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
}

// Export the initialized Firebase and analytics instances
export {
    auth,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    firebase,
    getAuth,
    getDownloadURL,
    GoogleAuthProvider,
    // messaging,
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    signOut,
    storage,
    ref,
    updateProfile,
    uploadBytes,
};
