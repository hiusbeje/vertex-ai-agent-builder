// Vertex AI Security and Authentication
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    if (document.querySelector('.login-page') && document.getElementById('login-form')) {
        setupLoginForm();
    }
    
    // Check if we're on a protected page
    if (document.querySelector('.dashboard')) {
        verifyAuthentication();
    }
});

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validate credentials
        if (validateCredentials(username, password)) {
            // Store authentication state
            storeAuthState(username);
            
            // Redirect to dashboard
            window.location.href = 'dashboard/index.html';
        } else {
            // Show error message
            showLoginError();
        }
    });
}

// Validate user credentials
function validateCredentials(username, password) {
    // In a real application, this would validate against a server
    // For now, we'll use hardcoded credentials
    return username === 's7x' && password === '2008.11.26';
}

// Store authentication state
function storeAuthState(username) {
    localStorage.setItem('vertexLoggedIn', 'true');
    localStorage.setItem('vertexUsername', username);
    localStorage.setItem('vertexLoginTime', Date.now());
    
    // Set default user preferences if not already set
    if (!localStorage.getItem('vertexUserPreferences')) {
        const defaultPreferences = {
            theme: 'dark',
            language: 'ar',
            notifications: true,
            dashboardLayout: 'default',
            contentTone: 'conversational',
            contentLength: 'medium'
        };
        
        localStorage.setItem('vertexUserPreferences', JSON.stringify(defaultPreferences));
    }
}

// Show login error
function showLoginError() {
    const errorElement = document.getElementById('login-error');
    
    if (errorElement) {
        errorElement.style.display = 'block';
        
        // Hide error after 3 seconds
        setTimeout(function() {
            errorElement.style.display = 'none';
        }, 3000);
    }
}

// Verify authentication for protected pages
function verifyAuthentication() {
    const isLoggedIn = localStorage.getItem('vertexLoggedIn') === 'true';
    const username = localStorage.getItem('vertexUsername');
    const loginTime = parseInt(localStorage.getItem('vertexLoginTime') || '0');
    
    // Check if logged in
    if (!isLoggedIn || !username) {
        redirectToLogin();
        return;
    }
    
    // Check session expiration (24 hours)
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (currentTime - loginTime > sessionDuration) {
        // Session expired
        logout();
        return;
    }
    
    // Update login time to extend session
    localStorage.setItem('vertexLoginTime', currentTime);
    
    // Setup logout functionality
    setupLogout();
}

// Redirect to login page
function redirectToLogin() {
    // Show login redirect message
    document.getElementById('dashboard-container').style.display = 'none';
    document.getElementById('login-redirect').style.display = 'flex';
}

// Setup logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Logout function
function logout() {
    // Clear authentication state
    localStorage.removeItem('vertexLoggedIn');
    localStorage.removeItem('vertexUsername');
    localStorage.removeItem('vertexLoginTime');
    
    // Redirect to login page
    window.location.href = '../login.html';
}

// Check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) {
        strength += 1;
    }
    
    // Contains lowercase
    if (/[a-z]/.test(password)) {
        strength += 1;
    }
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) {
        strength += 1;
    }
    
    // Contains number
    if (/[0-9]/.test(password)) {
        strength += 1;
    }
    
    // Contains special character
    if (/[^a-zA-Z0-9]/.test(password)) {
        strength += 1;
    }
    
    return strength;
}

// Display password strength
function displayPasswordStrength(strength) {
    const strengthElement = document.getElementById('password-strength');
    
    if (!strengthElement) return;
    
    // Clear previous classes
    strengthElement.className = 'password-strength';
    
    // Set strength class and text
    switch (strength) {
        case 1:
            strengthElement.classList.add('weak');
            strengthElement.textContent = 'ضعيف جداً';
            break;
        case 2:
            strengthElement.classList.add('weak');
            strengthElement.textContent = 'ضعيف';
            break;
        case 3:
            strengthElement.classList.add('medium');
            strengthElement.textContent = 'متوسط';
            break;
        case 4:
            strengthElement.classList.add('strong');
            strengthElement.textContent = 'قوي';
            break;
        case 5:
            strengthElement.classList.add('very-strong');
            strengthElement.textContent = 'قوي جداً';
            break;
        default:
            strengthElement.classList.add('weak');
            strengthElement.textContent = 'ضعيف جداً';
    }
}
