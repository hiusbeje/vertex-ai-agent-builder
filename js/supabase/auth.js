// Authentication Module for Supabase
import supabase from './client.js';

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Registration result
 */
async function registerUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error registering user:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Login result
 */
async function loginUser(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error logging in:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Logout current user
 * @returns {Promise} - Logout result
 */
async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error logging out:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Get current user session
 * @returns {Promise} - User session
 */
async function getCurrentUser() {
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { success: true, session: data.session, user: data.session?.user };
    } catch (error) {
        console.error('Error getting user session:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} - Authentication status
 */
async function isAuthenticated() {
    const { success, session } = await getCurrentUser();
    return success && session !== null;
}

/**
 * Reset password for user
 * @param {string} email - User email
 * @returns {Promise} - Password reset result
 */
async function resetPassword(email) {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error resetting password:', error.message);
        return { success: false, error: error.message };
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    isAuthenticated,
    resetPassword
};
