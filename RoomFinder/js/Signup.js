// js/signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  set 
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";

// Firebase configuration
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
const database = getDatabase(app);

// DOM elements
const signupForm = document.getElementById('signupForm');
const submitBtn = document.querySelector('.submit-btn');

// Universal spinner animation
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
    Creating Account...
  `;
  btn.disabled = true;
  return originalHTML;
};

const restoreButton = (btn, originalHTML) => {
  btn.innerHTML = originalHTML;
  btn.disabled = false;
};

// Input validation
const validateInputs = () => {
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const verifyPassword = document.getElementById('verifyPassword').value;
  const termsChecked = document.getElementById('termsAgreement').checked;

  let isValid = true;

  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

  // Validation checks
  if (!fullName) {
    showError('fullName', 'Full name is required');
    isValid = false;
  }

  if (!email) {
    showError('signupEmail', 'Email is required');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('signupEmail', 'Please enter a valid email');
    isValid = false;
  }

  if (!password) {
    showError('signupPassword', 'Password is required');
    isValid = false;
  } else if (password.length < 8) {
    showError('signupPassword', 'Password must be at least 8 characters');
    isValid = false;
  }

  if (password !== verifyPassword) {
    showError('verifyPassword', 'Passwords do not match');
    isValid = false;
  }

  if (!termsChecked) {
    showError('termsAgreement', 'You must accept the terms');
    isValid = false;
  }

  return isValid ? { fullName, email, password } : null;
};

// Show error message
const showError = (elementId, message) => {
  const element = document.getElementById(elementId);
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  element.parentNode.appendChild(errorElement);
  element.classList.add('input-error');
};

// Handle signup errors
const handleSignupError = (error) => {
  const errorMessages = {
    'auth/email-already-in-use': 'Email already in use',
    'auth/invalid-email': 'Invalid email address',
    'auth/weak-password': 'Password should be at least 6 characters'
  };
  
  alert(errorMessages[error.code] || 'Signup failed. Please try again.');
};

// Form submission handler
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const inputs = validateInputs();
  if (!inputs) return;

  const originalBtn = showSpinner(submitBtn);

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      inputs.email, 
      inputs.password
    );
    
    // Update user profile
    await updateProfile(userCredential.user, {
      displayName: inputs.fullName
    });

    // Save user data
    await set(ref(database, 'users/' + userCredential.user.uid), {
      fullName: inputs.fullName,
      email: inputs.email,
      createdAt: new Date().toISOString()
    });

    // Redirect on success
    setTimeout(() => {
      window.location.href = 'Home.html';
    }, 1500);
    
  } catch (error) {
    handleSignupError(error);
    restoreButton(submitBtn, originalBtn);
  }
});

// Add minimal spinner animation style
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .error-message {
      color: #e53e3e;
      font-size: 0.8rem;
      margin-top: 0.3rem;
      text-align: left;
    }
    
    .input-error {
      border-color: #e53e3e !important;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
`);