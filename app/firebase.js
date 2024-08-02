// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {getFirestore} from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD1V2PSp4NfoOEKFiqiV-U7kEzeGCRn8ho",
//   authDomain: "inventory-management-98e31.firebaseapp.com",
//   projectId: "inventory-management-98e31",
//   storageBucket: "inventory-management-98e31.appspot.com",
//   messagingSenderId: "770896684931",
//   appId: "1:770896684931:web:805c1a4bc41005e65d38b6",
//   measurementId: "G-JECBW1BR0X"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const firestore = getFirestore(app);

// export {firestore};

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1V2PSp4NfoOEKFiqiV-U7kEzeGCRn8ho",
  authDomain: "inventory-management-98e31.firebaseapp.com",
  projectId: "inventory-management-98e31",
  storageBucket: "inventory-management-98e31.appspot.com",
  messagingSenderId: "770896684931",
  appId: "1:770896684931:web:805c1a4bc41005e65d38b6",
  measurementId: "G-JECBW1BR0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { firestore, analytics };


