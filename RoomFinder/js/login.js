// js/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
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
  databaseURL: "https://room-finder-v1-default-rtdb.firebaseio.com",
  projectId: "room-finder-v1",
  storageBucket: "room-finder-v1.appspot.com",
  messagingSenderId: "156456101448",
  appId: "1:156456101448:web:2639d6d24d58862043da7d",
  measurementId: "G-3QCM5F74WQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const submitBtn = document.querySelector('.submit-btn');

// Device Detection
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Spinner Functions
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
const handleSocialAuth = async (provider, btnId) => {
  try {
    const btn = document.getElementById(btnId);
    const originalBtn = showSpinner(btn);
    
    if (isMobileDevice()) {
      provider.setCustomParameters({
        display: 'touch'
      });
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
      window.location.href = 'Home.html';
    }
  } catch (error) {
    throw error;
  }
};

// Handle Redirect Result
const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      window.location.href = 'Home.html';
    }
  } catch (error) {
    showError(error);
  }
};

// Enhanced Error Handler
const showError = (error) => {
  const messages = {
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email already in use',
    'auth/operation-not-allowed': 'This operation is not allowed',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/popup-closed-by-user': 'Login window was closed',
    'auth/account-exists-with-different-credential': 'Account exists with different login method',
    'auth/popup-blocked': 'Popup blocked. Please allow popups for this site',
    'auth/cancelled-popup-request': 'Another login attempt is in progress',
    'auth/web-storage-unsupported': 'Your browser settings prevent login. Try another browser or enable cookies',
    'auth/internal-error': 'Something went wrong. Please try again'
  };
  
  const errorMessage = messages[error.code] || `Login failed: ${error.message}`;
  
  // Create a more user-friendly error display
  const errorElement = document.getElementById('loginError') || document.createElement('div');
  errorElement.id = 'loginError';
  errorElement.style.color = '#ff4444';
  errorElement.style.marginTop = '10px';
  errorElement.style.padding = '10px';
  errorElement.style.borderRadius = '4px';
  errorElement.style.backgroundColor = '#ffebee';
  errorElement.style.textAlign = 'center';
  errorElement.innerHTML = errorMessage;
  
  if (!document.getElementById('loginError')) {
    loginForm.appendChild(errorElement);
  }
  
  // Auto-hide error after 5 seconds
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
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
document.addEventListener('DOMContentLoaded', () => {
  handleRedirectResult();
  
  ['googleBtn', 'facebookBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', async () => {
        try {
          await handleSocialAuth(
            id === 'googleBtn' ? new GoogleAuthProvider() : new FacebookAuthProvider(),
            id
          );
        } catch (error) {
          showError(error);
          const btn = document.getElementById(id);
          if (btn) {
            btn.innerHTML = id === 'googleBtn' ? 'Continue with Google' : 'Continue with Facebook';
            btn.disabled = false;
          }
        }
      });
    }
  });
});

// Add spinner animation style
if (!document.querySelector('style[data-spinner]')) {
  document.head.insertAdjacentHTML('beforeend', `
    <style data-spinner>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `);
}
