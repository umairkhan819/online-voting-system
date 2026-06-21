// ----------------------------------------------------------------------
// Nav Auth State Script
//
// Expects these ids in your HTML (see chat for what to add):
//   #loginBtn       - the Login button
//   #registerBtn    - the Register button
//   #profileAvatar  - container div for the avatar circle (new element)
//   #avatarInitial  - span inside the avatar showing the first-letter fallback
//   #avatarImage    - img inside the avatar for a profile picture
//
// Session lookup checks BOTH localStorage and sessionStorage for
// "currentUser", since login.js stores it in localStorage when
// "Remember Me" is checked, and in sessionStorage otherwise.
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', initNavAuthState);

function initNavAuthState() {
  const loginBtn     = document.getElementById('loginBtn');
  const registerBtn  = document.getElementById('registerBtn');
  const avatarEl      = document.getElementById('profileAvatar');
  const avatarInitial = document.getElementById('avatarInitial');
  const avatarImage   = document.getElementById('avatarImage');

  const session = getActiveSession();

  if (!session) {
    // No active session: show Login + Register, hide avatar
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (registerBtn) registerBtn.classList.remove('hidden');
    if (avatarEl) {
      avatarEl.classList.add('hidden');
      avatarEl.classList.remove('flex');
    }
    return;
  }

  // Active session: hide Login + Register, show avatar
  if (loginBtn) loginBtn.classList.add('hidden');
  if (registerBtn) registerBtn.classList.add('hidden');

  if (avatarEl) {
    avatarEl.classList.remove('hidden');
    avatarEl.classList.add('flex');
  }

  if (session.profilePicture && avatarImage) {
    avatarImage.src = session.profilePicture;
    avatarImage.classList.remove('hidden');
    if (avatarInitial) avatarInitial.classList.add('hidden');
  } else if (avatarInitial) {
    const name = (session.fullName || '?').trim();
    avatarInitial.textContent = name.charAt(0).toUpperCase();
    avatarInitial.classList.remove('hidden');
    if (avatarImage) avatarImage.classList.add('hidden');
  }
}

function getActiveSession() {
  try {
    const fromLocal = localStorage.getItem('currentUser');
    if (fromLocal) return JSON.parse(fromLocal);

    const fromSession = sessionStorage.getItem('currentUser');
    if (fromSession) return JSON.parse(fromSession);
  } catch (e) {
    console.warn('Could not read session:', e);
  }
  return null;
}
// ----------------------------------------------------------------------
// Profile Dropdown Script
//
// Requires nav-auth.js to be loaded BEFORE this script on the page -
// it reuses the getActiveSession() helper defined there.
//
// Expects these ids in your HTML (new markup - see chat for what to add):
//   #profileAvatar     - the avatar circle (already exists)
//   #profileDropdown    - dropdown container (new)
//   #dropdownUserName   - element showing the user's name (new)
//   #logoutBtn          - logout button inside the dropdown (new)
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', initProfileDropdown);

function initProfileDropdown() {
  const avatarEl   = document.getElementById('profileAvatar');
  const dropdownEl = document.getElementById('profileDropdown');
  const nameEl     = document.getElementById('dropdownUserName');
  const logoutBtn  = document.getElementById('logoutBtn');

  if (!avatarEl || !dropdownEl) return;

  // Fill in the user's name as soon as we know there's a session
  const session = typeof getActiveSession === 'function' ? getActiveSession() : null;
  if (session && nameEl) {
    nameEl.textContent = session.fullName || 'Account';
  }

  // Toggle dropdown when the avatar is clicked
  avatarEl.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownEl.classList.toggle('hidden');
  });

  // Close the dropdown when clicking anywhere outside it
  document.addEventListener('click', function (e) {
    if (!dropdownEl.classList.contains('hidden') &&
        !dropdownEl.contains(e.target) &&
        !avatarEl.contains(e.target)) {
      dropdownEl.classList.add('hidden');
    }
  });

  // Logout: clear the session from both storages and head back to the homepage
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  }
}