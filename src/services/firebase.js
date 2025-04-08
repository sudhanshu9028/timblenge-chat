// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBcnuXwAMP_UVAJoLfXZjwkD6c7tpY_nkA',
  authDomain: 'timblenge.firebaseapp.com',
  projectId: 'timblenge',
  storageBucket: 'timblenge.firebasestorage.app',
  messagingSenderId: '256401750909',
  appId: '1:256401750909:web:fcdef6d61cbe1188b82a14',
  measurementId: 'G-4TWC1HX0VK',
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// export default app;
