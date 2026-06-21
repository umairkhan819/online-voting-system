// ----------------------------------------------------------------------
// User Registration Script
//
// Expects these ids in your HTML:
//   #registerForm   - the <form> element (already present)
//   #fullName       - full name text input        (you need to add this)
//   #email          - email input                 (you need to add this)
//   #pass1          - password input               (already present)
//   #pass2          - confirm password input        (already present)
//   #cnic           - CNIC text input, optional field (you need to add this)
//   #phone          - phone text input, optional field (you need to add this)
//
// Optional ids (script works fine without them):
//   #agree          - terms checkbox -> only validated if this id exists
//   #role           - role select/radio -> defaults to "Voter" if missing
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registerForm');
  if (!form) return;
  form.addEventListener('submit', handleRegister);
});

function handleRegister(e) {
  e.preventDefault();
  clearAllFieldErrors();

  // ---- Step 2: read user input ----
  const fullNameEl = document.getElementById('fullName');
  const emailEl    = document.getElementById('email');
  const cnicEl     = document.getElementById('cnic');
  const phoneEl    = document.getElementById('phone');
  const pass1El    = document.getElementById('pass1');
  const pass2El    = document.getElementById('pass2');
  const agreeEl    = document.getElementById('agree');
  const roleEl     = document.getElementById('role');

  const fullName = fullNameEl ? fullNameEl.value.trim() : '';
  const email    = emailEl ? emailEl.value.trim().toLowerCase() : '';
  const cnic     = cnicEl ? cnicEl.value.trim() : '';
  const phone    = phoneEl ? phoneEl.value.trim() : '';
  const pass1    = pass1El ? pass1El.value : '';
  const pass2    = pass2El ? pass2El.value : '';
  const role     = roleEl ? roleEl.value : 'Voter';

  let isValid = true;

  // ---- Step 3: required fields ----
  if (!fullName) {
    fieldError(fullNameEl, 'fullName', 'Full name is required.');
    isValid = false;
  }

  if (!email) {
    fieldError(emailEl, 'email', 'Email address is required.');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldError(emailEl, 'email', 'Enter a valid email address.');
    isValid = false;
  }

  if (!pass1) {
    fieldError(pass1El, 'pass1', 'Password is required.');
    isValid = false;
  }

  if (!pass2) {
    fieldError(pass2El, 'pass2', 'Please confirm your password.');
    isValid = false;
  }

  // Optional: only enforced if you add id="agree" to the checkbox
  if (agreeEl && !agreeEl.checked) {
    fieldError(agreeEl, 'agree', 'You must agree to the Terms & Privacy Policy.');
    isValid = false;
  }

  // ---- Step 4: CNIC format, only if a value was entered ----
  if (cnic && !/^\d{5}-\d{7}-\d{1}$/.test(cnic)) {
    fieldError(cnicEl, 'cnic', 'CNIC must be in the format 12345-1234567-1.');
    isValid = false;
  }

  // ---- Step 5: email already registered ----
  const users = getUsers();
  if (email && users.some(function (u) { return u.email === email; })) {
    fieldError(emailEl, 'email', 'This email address is already registered.');
    isValid = false;
  }

  // ---- Step 6: passwords match ----
  if (pass1 && pass2 && pass1 !== pass2) {
    fieldError(pass2El, 'pass2', 'Passwords do not match.');
    isValid = false;
  }

  // ---- Step 7: stop on any failure ----
  if (!isValid) return;

  // ---- Step 8: create the account ----
  const newUser = {
    id: generateUserId(),
    fullName: fullName,
    email: email,
    cnic: cnic || null,
    phone: phone || null,
    password: pass1, // prototype only - plaintext in localStorage, not production-safe
    role: role,
    hasVoted: false,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // ---- Step 9 & 10: confirm, then redirect to login ----
  const form = document.getElementById('registerForm');
  showSuccessMessage(form);
  form.reset();

  setTimeout(function () {
    window.location.href = 'login.html';
  }, 1500);
}

// ---------------- helpers ----------------

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]');
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function generateUserId() {
  return 'USR-' + Date.now().toString(36).toUpperCase() + '-' +
    Math.random().toString(36).substring(2, 7).toUpperCase();
}

// Referenced by your existing onclick="togglePass('pass1')" buttons
function togglePass(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

// Creates an inline error message under a field on the fly,
// so no extra elements need to be added to your HTML.
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
  document.querySelectorAll('[id$="Error"]').forEach(function (el) {
    el.remove();
  });
  document.querySelectorAll('#registerForm input').forEach(function (el) {
    el.classList.remove('border-red-400', 'ring-2', 'ring-red-100');
  });
  const existingBanner = document.getElementById('registerSuccessBanner');
  if (existingBanner) existingBanner.remove();
}

function showSuccessMessage(form) {
  const banner = document.createElement('div');
  banner.id = 'registerSuccessBanner';
  banner.className = 'mb-5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl px-4 py-3 text-center';
  banner.textContent = 'Registration Successful. Redirecting to login…';
  form.parentElement.insertBefore(banner, form);
}
