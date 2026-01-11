/**
 * Inicjalizacja Firebase SDK.
 * Eksportuje instancje db (Firestore) i auth (Authentication) używane przez repositories i AuthGuard.
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const firebaseConfig = {
  apiKey: "AIzaSyDiyQRjNceQa7LMaHFhBMrpUMbqOdKJl18",
  authDomain: isLocalhost ? "thairapy.firebaseapp.com" : "thairapy.jdhub.shop",
  projectId: "thairapy",
  storageBucket: "thairapy.firebasestorage.app",
  messagingSenderId: "799172483804",
  appId: "1:799172483804:web:85b2f03f69463a9d8e7219"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
