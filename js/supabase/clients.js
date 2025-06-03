// Clients CRUD Module for Supabase
import supabase from './client.js';

/**
 * Get all clients
 * @returns {Promise} - List of clients
 */
async function getClients() {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching clients:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Get client by ID
 * @param {string} id - Client ID
 * @returns {Promise} - Client data
 */
async function getClientById(id) {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching client:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Create new client
 * @param {Object} clientData - Client data
 * @returns {Promise} - Creation result
 */
async function createClient(clientData) {
    try {
        const { data, error } = await supabase
            .from('clients')
            .insert([clientData])
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error creating client:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Update client
 * @param {string} id - Client ID
 * @param {Object} clientData - Updated client data
 * @returns {Promise} - Update result
 */
async function updateClient(id, clientData) {
    try {
        const { data, error } = await supabase
            .from('clients')
            .update(clientData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating client:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Delete client
 * @param {string} id - Client ID
 * @returns {Promise} - Deletion result
 */
async function deleteClient(id) {
    try {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting client:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Search clients
 * @param {string} query - Search query
 * @returns {Promise} - Search results
 */
async function searchClients(query) {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error searching clients:', error.message);
        return { success: false, error: error.message };
    }
}

export {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    searchClients
};
