# online-voting-system

VoteHub is a front-end prototype of an online voting platform. It lets voters register, log in, browse candidates, cast a vote, and view live results — while administrators can log in separately to start/end an election and manage the candidate list.


⚠️ Prototype status: All data (users, sessions, candidates, votes) is stored in the browser via localStorage / sessionStorage. There is no backend, database, or real authentication. This project is suitable for demos, coursework, and UI prototyping — not for running a real election. See Security Notes before using this for anything real.




Table of Contents


Features
Tech Stack
Project Structure
Pages
Getting Started
How Authentication Works
Dark Mode
Admin Panel
Security Notes
Known Limitations
Roadmap Ideas



Features


🏠 Marketing homepage with stats, features, and a "How It Works" walkthrough
📝 Voter registration with client-side validation (email format, password match, CNIC format, duplicate-email check)
🔐 Voter login with optional "Remember Me" (persists session across browser restarts)
🛡️ Separate Administrator login, fully decoupled from voter accounts
📊 Admin Dashboard: start/end the election, add/remove candidates, see live counts
🧑‍🤝‍🧑 Candidates directory with filtering UI (search, position, department, year)
🗳️ Vote casting screen with single-select candidate cards
✅ Submission confirmation page + "already voted" guard page
📈 Results page with a live-style breakdown bar chart and a Chart.js doughnut chart
❓ FAQ page with an accordion UI
🌙 Site-wide dark/light theme toggle, persisted across pages and sessions
👤 Dynamic navbar — shows Login/Register buttons or a profile avatar + dropdown depending on session state


Tech Stack

LayerToolMarkupPlain HTML5 (no framework, no build step)StylingTailwind CSS via CDN, plus a small custom override stylesheet for dark modeIconsLucide Icons via CDNChartsChart.js via CDNFontsGoogle Fonts — InterLogicVanilla JavaScript (ES6), no frameworkPersistenceBrowser localStorage / sessionStorage

No npm install, no bundler, no build pipeline — every page can be opened directly or served as static files.

Project Structure

votehub/
├── index.html              # Homepage
├── login.html              # Voter login
├── register.html           # Voter registration
├── admin-login.html        # Administrator login
├── admin.html               # Admin dashboard (election control + candidates)
├── candidates.html         # Public candidates directory
├── results.html            # Live results / charts
├── faqs.html                # FAQ accordion
├── hiw.html                  # "How It Works" page
├── vote.html                 # Cast your vote
├── vote-cnf.html             # Vote submitted successfully
├── voted.html                 # "You've already voted" guard page
│
├── dark-mode.css            # Shared dark-theme CSS overrides
├── dark-mode.js              # Theme toggle logic (load on every page)
├── nav-auth.js                # Navbar auth-state + profile dropdown logic
├── login.js                   # Voter login form handler
├── register.js                # Voter registration form handler
├── admin-login.js             # Administrator login form handler
├── admin.js                   # Admin dashboard logic (election control, candidates)
└── vote-access.js             # "Vote Now" button routing logic

Pages

PagePurposeAuth requiredindex.htmlMarketing homepageNoregister.htmlCreate a voter accountNologin.htmlVoter loginNoadmin-login.htmlAdministrator loginNoadmin.htmlManage election + candidatesYes (admin)candidates.htmlBrowse all candidatesNohiw.htmlHow voting works, step by stepNovote.htmlSelect and submit a voteYes (voter)vote-cnf.htmlVote success confirmationYes (voter)voted.htmlShown if voter tries to vote twiceYes (voter)results.htmlLive results dashboardNofaqs.htmlFrequently asked questionsNo

Getting Started

Since there's no build step, you just need a local static server (opening files directly with file:// will work for most pages, but some browsers block fetch/storage APIs on file://, so a local server is recommended).

Option A — Python

bashcd votehub
python3 -m http.server 8000

Then visit http://localhost:8000.

Option B — Node

bashnpx serve .

Option C — VS Code
Use the "Live Server" extension and click "Go Live" from index.html.

Demo Walkthrough


Open index.html → click Register → create a voter account.
You're redirected to login.html → log in with the same credentials.
Click Vote Now → land on vote.html → select a candidate → submit.
You're routed to vote-cnf.html (or voted.html if you try voting again).
Open admin-login.html in a separate session/incognito window to manage the election from admin.html.


How Authentication Works

VoteHub uses two independent auth systems — they don't share storage or logic:

Voters (register.js / login.js / nav-auth.js)


Registering writes a new user object into a users array in localStorage.
Logging in checks the entered email/password against that array.
On success, a trimmed-down session object (no password) is saved to either localStorage.currentUser (if "Remember Me" is checked) or sessionStorage.currentUser (if not).
nav-auth.js reads that session on every page load to decide whether the navbar shows Login/Register buttons or a profile avatar.


Administrator (admin-login.js)


Uses a single hardcoded username/password pair checked directly in JavaScript.
On success, redirects straight to admin.html with no session object stored at all — there is currently no persistent "admin is logged in" state, so refreshing or revisiting admin.html directly will not re-check credentials.


Dark Mode

Dark mode is intentionally framework-light so it could be retrofitted onto pages with hand-written Tailwind classes (rather than the official Tailwind dark: variant system).


dark-mode.js reads the saved theme from localStorage on page load and toggles a dark class on <html>. It also listens for clicks on #theme-toggle (the moon/sun icon) using event delegation, so the listener keeps working even after Lucide re-renders the icon element.
dark-mode.css contains html.dark ... override rules targeting the actual Tailwind utility classes used across the site (bg-white, text-slate-500, border-slate-100, the gray palette, opacity-suffixed classes like bg-white/80, and page-specific custom classes like .glass-card / .login-card / .input-field).


Every page must include, in this relative order:

html<!-- in <head>, after Tailwind -->
<link rel="stylesheet" href="/dark-mode.css">

<!-- right before </body> -->
<script src="/dark-mode.js"></script>

And somewhere in the navbar:

html<i id="theme-toggle" data-lucide="moon" class="w-5 h-5 text-slate-500 cursor-pointer"></i>


When adding a new page, check it for any Tailwind opacity-suffixed classes (bg-white/80), the gray-* palette instead of slate-*, or custom CSS classes with hardcoded colors — these need their own override rule added to dark-mode.css, since the existing rules only cover patterns already used elsewhere in the site.



Admin Panel

admin.html + admin.js implement:


Election Control — Start/End Voting buttons that toggle election status (Not Started → Running → Ended), reflected in a status badge and a stat card.
Candidate Management — Add Candidate (via prompt() dialogs for name/position/party) and Remove Candidate (via a delegated click listener on the candidate list container, so newly-added cards are removable without extra wiring).


Default admin credentials (hardcoded in admin-login.js — change these before any real deployment):

Username: umair
Password: (123456)@?

Security Notes

This project is not secure in its current form. Before using it beyond a demo:


🔴 Plaintext passwords — voter passwords are stored as plain text inside localStorage, fully readable via browser dev tools.
🔴 Hardcoded admin credentials — visible to anyone who views admin-login.js.
🔴 No real session validation — anyone can fabricate a currentUser object in localStorage/sessionStorage via dev tools and impersonate a logged-in voter or skip the admin login entirely by navigating straight to admin.html.
🔴 No server-side vote integrity checks — votes aren't actually tallied or sent anywhere; the "results" page shows static sample data.
🔴 CNIC/personal data stored unencrypted in the browser.


A production version would need a real backend (e.g. Node/Express, Django, etc.), a proper database, hashed passwords (bcrypt/argon2), server-issued session tokens or JWTs, and server-side validation of every vote and admin action.

Known Limitations


Results page (results.html) displays hardcoded sample numbers — it is not wired to actual votes cast through vote.html.
The admin dashboard's candidate list is not persisted — refreshing admin.html resets it to the three seeded candidates.
The "Forgot Password" link on the login page is not yet implemented.
Some pages (e.g. candidates.html's mobile menu button) reference element IDs that may not exist on every viewport — verify mobile menu wiring before relying on it.


Roadmap Ideas


Wire results.html to real vote counts (e.g. via a backend API or aggregated localStorage data for demo purposes)
Persist admin-added/removed candidates (backend, or at minimum localStorage)
Add a real admin session/guard so admin.html can't be reached by direct URL without logging in
Hash voter passwords client-side before storage (still not "secure," but better for a prototype)
Replace prompt()-based candidate creation in admin.js with a proper modal form
Add automated tests for the registration/login validation logic



Made with ❤️ for a better democracy.