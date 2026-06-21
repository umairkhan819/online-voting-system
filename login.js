// ----------------------------------------------------------------------
// Login Script
//
// Matches a user against the `users` array saved to localStorage by
// register.js, then redirects by role. Adjust DASHBOARD_BY_ROLE below
// to point at your real pages.
//
// Expects these ids in your HTML:
//   #loginForm   - the <form> element            (you need to add this)
//   #email       - email input                   (you need to add this)
//   #password    - password input                 (already present)
//
// Optional id:
//   #rememberMe  - checkbox -> checked: session persists in localStorage.
//                  unchecked or missing: session lives in sessionStorage
//                  only, and clears when the tab closes.
// ----------------------------------------------------------------------

const DASHBOARD_BY_ROLE = {
  Voter: 'vote.html',
  Candidate: 'candidate-dashboard.html'
};
const DEFAULT_DASHBOARD = 'dashboard.html';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', handleLogin);
});

function handleLogin(e) {
  e.preventDefault();
  clearAllFieldErrors();

  const emailEl    = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const rememberEl = document.getElementById('rememberMe');

  const email    = emailEl ? emailEl.value.trim().toLowerCase() : '';
  const password = passwordEl ? passwordEl.value : '';
  const remember = rememberEl ? rememberEl.checked : true; // persistent by default if no checkbox

  let isValid = true;

  if (!email) {
    fieldError(emailEl, 'email', 'Email address is required.');
    isValid = false;
  }
  if (!password) {
    fieldError(passwordEl, 'password', 'Password is required.');
    isValid = false;
  }
  if (!isValid) return;

  const users = getUsers();
  const user = users.find(function (u) { return u.email === email; });

  if (!user) {
    fieldError(emailEl, 'email', 'No account found with this email.');
    return;
  }

  if (user.password !== password) {
    fieldError(passwordEl, 'password', 'Incorrect password.');
    return;
  }

  // Session object kept around for the rest of the app - password excluded.
  const session = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    hasVoted: user.hasVoted
  };

  if (remember) {
    localStorage.setItem('currentUser', JSON.stringify(session));
    sessionStorage.removeItem('currentUser');
  } else {
    sessionStorage.setItem('currentUser', JSON.stringify(session));
    localStorage.removeItem('currentUser');
  }

  const form = document.getElementById('loginForm');
  showSuccessMessage(form);

  const destination = DASHBOARD_BY_ROLE[user.role] || DEFAULT_DASHBOARD;
  setTimeout(function () {
    window.location.href = destination;
  }, 1200);
}

// Referenced by your existing onclick="togglePassword()" button
function togglePassword() {
  const input = document.getElementById('password');
  const icon  = document.getElementById('eye-icon');
  if (!input) return;
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  if (icon) {
    icon.setAttribute('data-lucide', showing ? 'eye' : 'eye-off');
    if (window.lucide) window.lucide.createIcons();
  }
}

// ---------------- helpers ----------------

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]');
  } catch (e) {
    return [];
  }
}

function fieldError(inputEl, key, message) {
  if (!inputEl) {
    console.warn('Missing element for "' + key + '" - add id="' + key + '" in your HTML.');
    return;
  }
  inputEl.classList.add('border-red-400', 'ring-2', 'ring-red-100');

  let msgEl = document.getElementById(key + 'Error');
  if (!msgEl) {
    msgEl = document.createElement('p');
    msgEl.id = key + 'Error';
    msgEl.className = 'text-xs text-red-500 font-medium mt-1';
    const wrapper = inputEl.closest('.relative') || inputEl;
    wrapper.insertAdjacentElement('afterend', msgEl);
  }
  msgEl.textContent = message;
}

function clearAllFieldErrors() {
  document.querySelectorAll('[id$="Error"]').forEach(function (el) { el.remove(); });
  document.querySelectorAll('#loginForm input').forEach(function (el) {
    el.classList.remove('border-red-400', 'ring-2', 'ring-red-100');
  });
  const banner = document.getElementById('loginSuccessBanner');
  if (banner) banner.remove();
}

function showSuccessMessage(form) {
  const banner = document.createElement('div');
  banner.id = 'loginSuccessBanner';
  banner.className = 'mb-5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl px-4 py-3 text-center';
  banner.textContent = 'Login Successful. Redirecting…';
  form.parentElement.insertBefore(banner, form);
}
