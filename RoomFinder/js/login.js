// js/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBRTGz_G8DBvQbvF8YwGCN9rre-F8GGTD8",
  authDomain: "room-finder-v1.firebaseapp.com",
  databaseURL: "https://room-finder-v1-default-rtdb.firebaseio.com",
  projectId: "room-finder-v1",
  storageBucket: "room-finder-v1.appspot.com",
  messagingSenderId: "156456101448",
  appId: "1:156456101448:web:2639d6d24d58862043da7d",
  measurementId: "G-3QCM5F74WQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const submitBtn = document.querySelector('.submit-btn');

// Simple spinner animation that works everywhere
const showSpinner = (btn) => {
  const originalHTML = btn.innerHTML;
  btn.innerHTML = `
    <div style="
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    "></div>
    Processing...
  `;
  btn.disabled = true;
  return originalHTML;
};

const restoreButton = (btn, originalHTML) => {
  btn.innerHTML = originalHTML;
  btn.disabled = false;
};

// Core Login Function
const handleLogin = async (email, password) => {
  try {
    await setPersistence(
      auth, 
      document.getElementById('rememberMe').checked ? 
        browserLocalPersistence : browserSessionPersistence
    );
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'Home.html';
  } catch (error) {
    throw error;
  }
};

// Social Login Handler
const handleSocialAuth = async (provider) => {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = 'Home.html';
  } catch (error) {
    throw error;
  }
};

// Universal Error Handler
const showError = (error) => {
  const messages = {
    'auth/invalid-email': 'Please enter a valid email',
    'auth/user-not-found': 'Email not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Try later',
    'auth/network-request-failed': 'Network error. Check connection',
    'auth/popup-closed-by-user': 'Login window was closed',
    'auth/account-exists-with-different-credential': 'Account exists with different login method'
  };
  
  alert(messages[error.code] || 'Login failed. Please try again.');
};

// Form Submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const originalBtn = showSpinner(submitBtn);
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    await handleLogin(email, password);
  } catch (error) {
    showError(error);
    restoreButton(submitBtn, originalBtn);
  }
});

// Social Login Buttons
['googleBtn', 'facebookBtn'].forEach(id => {
  const btn = document.getElementById(id);
  btn.addEventListener('click', async () => {
    const originalBtn = showSpinner(btn);
    try {
      await handleSocialAuth(
        id === 'googleBtn' ? new GoogleAuthProvider() : new FacebookAuthProvider()
      );
    } catch (error) {
      showError(error);
      restoreButton(btn, originalBtn);
    }
  });
});

// Add minimal spinner animation style
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
`);