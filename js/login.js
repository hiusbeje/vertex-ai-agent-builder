// Login page script with Supabase integration
import { loginUser } from './supabase/auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
            submitButton.disabled = true;
            
            // Clear previous messages
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
            successMessage.textContent = '';
            successMessage.style.display = 'none';
            
            // Get form data
            const username = this.querySelector('input[name="username"]').value;
            const password = this.querySelector('input[name="password"]').value;
            
            // Hardcoded credentials check for demo
            if (username === 's7x' && password === '2008.11.26') {
                // Show success message
                successMessage.textContent = 'تم تسجيل الدخول بنجاح! جاري التحويل...';
                successMessage.style.display = 'block';
                
                // Store session in localStorage
                localStorage.setItem('vertex_user', JSON.stringify({
                    username: 's7x',
                    name: 'مستخدم Vertex',
                    role: 'admin',
                    isLoggedIn: true
                }));
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard/index.html';
                }, 1500);
            } else {
                // Try Supabase login
                try {
                    const { success, data, error } = await loginUser(username, password);
                    
                    if (success) {
                        // Show success message
                        successMessage.textContent = 'تم تسجيل الدخول بنجاح! جاري التحويل...';
                        successMessage.style.display = 'block';
                        
                        // Store user info in localStorage
                        localStorage.setItem('vertex_user', JSON.stringify({
                            username: data.user.email,
                            name: data.user.user_metadata?.full_name || 'مستخدم Vertex',
                            role: data.user.role || 'client',
                            isLoggedIn: true
                        }));
                        
                        // Redirect to dashboard
                        setTimeout(() => {
                            window.location.href = 'dashboard/index.html';
                        }, 1500);
                    } else {
                        // Show error message
                        errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
                        errorMessage.style.display = 'block';
                        
                        // Reset button
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                    }
                } catch (err) {
                    // Show error message
                    errorMessage.textContent = 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.';
                    errorMessage.style.display = 'block';
                    
                    // Reset button
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }
            }
        });
    }
});
