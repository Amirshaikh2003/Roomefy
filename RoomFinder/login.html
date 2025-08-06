// js/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBRTGz_G8DBvQbvF8YwGCN9rre-F8GGTD8",
  authDomain: "room-finder-v1.firebaseapp.com",
  projectId: "room-finder-v1",
  storageBucket: "room-finder-v1.appspot.com",
  messagingSenderId: "156456101448",
  appId: "1:156456101448:web:2639d6d24d58862043da7d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check for redirect result on page load
(async function checkRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) window.location.href = 'Home.html';
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
})();

// Handle email/password login
async function emailLogin(email, password, rememberMe) {
  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'Home.html';
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
}

// Handle Google login
async function googleLogin() {
  const provider = new GoogleAuthProvider();
  
  try {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Mobile devices - use redirect
      await signInWithRedirect(auth, provider);
    } else {
      // Desktop - use popup
      const result = await signInWithPopup(auth, provider);
      if (result.user) window.location.href = 'Home.html';
    }
  } catch (error) {
    alert(`Google login failed: ${error.message}`);
  }
}

// Form submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  if (email && password) {
    await emailLogin(email, password, rememberMe);
  }
});

// Google login button
document.getElementById('googleBtn')?.addEventListener('click', googleLogin);
