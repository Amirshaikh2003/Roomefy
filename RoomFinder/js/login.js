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
  browserLocalPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBRTGz_G8DBvQbvF8YwGCN9rre-F8GGTD8",
  authDomain: "room-finder-v1.firebaseapp.com",
  projectId: "room-finder-v1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auto-redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) window.location.href = "home.html";
});

// Handle email login
async function emailLogin(email, password, remember) {
  try {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle the redirect
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
}

// Handle Google login
async function googleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the redirect
    }
  } catch (error) {
    alert(`Google login failed: ${error.message}`);
  }
}

// Handle redirect result after Google login on mobile
(async function handleRedirect() {
  try {
    await getRedirectResult(auth);
  } catch (error) {
    console.log("Redirect result error:", error);
  }
})();

// Form submission
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const remember = document.getElementById('rememberMe').checked;
  emailLogin(email, password, remember);
});

// Google login button
document.getElementById('googleBtn')?.addEventListener('click', googleLogin);
