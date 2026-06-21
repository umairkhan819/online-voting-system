document.addEventListener('DOMContentLoaded', () => {
    const ADMIN_USERNAME = 'umair';
    const ADMIN_PASSWORD = '(123456)@?';

    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // stop normal form submission/page reload

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            errorMsg.classList.add('hidden');
            // Login Successful -> redirect
            window.location.href = 'admin.html';
        } else {
            // Invalid -> show error, stay on page (acts as the REPEAT loop)
            errorMsg.textContent = 'Invalid Username or Password. Please try again.';
            errorMsg.classList.remove('hidden');
        }
    });
});