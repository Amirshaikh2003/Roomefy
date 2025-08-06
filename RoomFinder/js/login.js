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

// Check for redirect result immediately
(async function initAuth() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      window.location.href = 'Home.html';
    }
  } catch (error) {
    console.error('Redirect result error:', error);
  }
})();

// Device Detection
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Core Login Function
const handleLogin = async (email, password) => {
  try {
    await setPersistence(
      auth, 
      document.getElementById('rememberMe')?.checked ? 
        browserLocalPersistence : browserSessionPersistence
    );
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'Home.html';
  } catch (error) {
    throw error;
  }
};

// Social Auth Handler
const handleSocialAuth = async (providerType) => {
  try {
    let provider;
    if (providerType === 'google') {
      provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
    } else if (providerType === 'facebook') {
      provider = new FacebookAuthProvider();
      provider.addScope('email');
    }

    if (isMobileDevice()) {
      // For mobile devices
      provider.setCustomParameters({
        display: 'touch',
        prompt: 'select_account'
      });
      await signInWithRedirect(auth, provider);
    } else {
      // For desktop
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        window.location.href = 'Home.html';
      }
    }
  } catch (error) {
    console.error(`${providerType} auth error:`, error);
    throw error;
  }
};

// Form Submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;
  
  if (!email || !password) return;

  try {
    await handleLogin(email, password);
  } catch (error) {
    console.error('Login error:', error);
    alert(getErrorMessage(error));
  }
});

// Social Login Buttons
document.getElementById('googleBtn')?.addEventListener('click', () => {
  handleSocialAuth('google').catch(error => {
    console.error('Google auth failed:', error);
    alert(getErrorMessage(error));
  });
});

document.getElementById('facebookBtn')?.addEventListener('click', () => {
  handleSocialAuth('facebook').catch(error => {
    console.error('Facebook auth failed:', error);
    alert(getErrorMessage(error));
  });
});

// Error Message Mapping
function getErrorMessage(error) {
  const errorMap = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'Account disabled',
    'auth/user-not-found': 'Account not found',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Try again later',
    'auth/network-request-failed': 'Network error. Check your connection',
    'auth/popup-closed-by-user': 'Login window was closed',
    'auth/account-exists-with-different-credential': 'Account exists with different login method',
    'auth/popup-blocked': 'Popup blocked. Allow popups for this site',
    'auth/cancelled-popup-request': 'Login process cancelled',
    'auth/web-storage-unsupported': 'Browser settings prevent login',
    'auth/internal-error': 'Login failed. Please try again'
  };
  
  return errorMap[error.code] || `Login error: ${error.message}`;
}
