// ----------------------------------------------------------------------
// Vote Now Access Script
//
// HTML CHANGE NEEDED: the Vote Now button's onclick currently does
//   onclick="window.location.href='register.html'"
// Change it to:
//   onclick="handleVoteNowClick()"
//
// Works with or without nav-auth.js loaded on the page - it'll reuse
// getActiveSession() from there if present, otherwise reads the session
// itself.
// ----------------------------------------------------------------------

const VOTING_PAGE_URL = 'vote.html';
const REGISTER_PAGE_URL = 'register.html';

function handleVoteNowClick() {
  const session = typeof getActiveSession === 'function'
    ? getActiveSession()
    : readSessionFallback();

  // Step 2: no active session -> Register page
  if (!session) {
    window.location.href = REGISTER_PAGE_URL;
    return;
  }

  // Step 3: confirm the account is still valid
  if (isAccountValid(session)) {
    // Step 4: valid -> Voting page
    window.location.href = VOTING_PAGE_URL;
  } else {
    // Session exists but doesn't match a real stored account
    // (e.g. tampered/partial localStorage) - fall back to Register.
    window.location.href = REGISTER_PAGE_URL;
  }
}

function isAccountValid(session) {
  if (!session || !session.id || !session.email) return false;
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(function (u) {
      return u.id === session.id && u.email === session.email;
    });
  } catch (e) {
    return false;
  }
}

// Fallback session reader, used only if nav-auth.js isn't loaded on this page
function readSessionFallback() {
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
