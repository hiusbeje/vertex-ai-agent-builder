// Projects CRUD Module for Supabase
import supabase from './client.js';

/**
 * Get all projects
 * @param {string} clientId - Optional client ID to filter projects
 * @returns {Promise} - List of projects
 */
async function getProjects(clientId = null) {
    try {
        let query = supabase
            .from('projects')
            .select('*, clients(name, email)') // Join with clients table
            .order('created_at', { ascending: false });
        
        // Filter by client if provided
        if (clientId) {
            query = query.eq('client_id', clientId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Get project by ID
 * @param {string} id - Project ID
 * @returns {Promise} - Project data
 */
async function getProjectById(id) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*, clients(name, email)')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching project:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Create new project
 * @param {Object} projectData - Project data
 * @returns {Promise} - Creation result
 */
async function createProject(projectData) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .insert([projectData])
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error creating project:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Update project
 * @param {string} id - Project ID
 * @param {Object} projectData - Updated project data
 * @returns {Promise} - Update result
 */
async function updateProject(id, projectData) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating project:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Delete project
 * @param {string} id - Project ID
 * @returns {Promise} - Deletion result
 */
async function deleteProject(id) {
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting project:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Search projects
 * @param {string} query - Search query
 * @returns {Promise} - Search results
 */
async function searchProjects(query) {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*, clients(name, email)')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error searching projects:', error.message);
        return { success: false, error: error.message };
    }
}

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    searchProjects
};
