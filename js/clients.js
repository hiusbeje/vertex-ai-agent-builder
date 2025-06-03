// Clients management script with Supabase integration
import { getCurrentUser, logoutUser } from '../js/supabase/auth.js';
import { getClients, getClientById, createClient, updateClient, deleteClient, searchClients } from '../js/supabase/clients.js';
import { getProjects } from '../js/supabase/projects.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    checkAuth();
    
    // Initialize clients management
    initClientsManagement();
    
    // Setup event listeners
    setupEventListeners();
});

// Check if user is authenticated
async function checkAuth() {
    // First check localStorage for demo purposes
    const storedUser = localStorage.getItem('vertex_user');
    
    if (!storedUser) {
        // Redirect to login page
        window.location.href = '../login.html';
        return;
    }
    
    // Parse user data
    const userData = JSON.parse(storedUser);
    
    // Update UI with user info
    updateUserInfo(userData);
    
    // Also try to verify with Supabase if available
    try {
        const { success, user } = await getCurrentUser();
        if (success && user) {
            // Update UI with Supabase user info if available
            updateUserInfo({
                name: user.user_metadata?.full_name || userData.name,
                username: user.email || userData.username,
                role: user.role || userData.role
            });
        }
    } catch (error) {
        console.log('Using local authentication only');
    }
}

// Update UI with user information
function updateUserInfo(userData) {
    // Update username display
    const usernameElements = document.querySelectorAll('.user-name');
    usernameElements.forEach(element => {
        element.textContent = userData.name;
    });
    
    // Update role display
    const roleElements = document.querySelectorAll('.user-role');
    roleElements.forEach(element => {
        element.textContent = userData.role === 'admin' ? 'مدير النظام' : 'عميل';
    });
    
    // Update avatar if available
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(element => {
        element.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=FFD700&color=000000`;
    });
}

// Initialize clients management
async function initClientsManagement() {
    // Show loading state
    document.getElementById('clients-loading').classList.remove('hidden');
    
    try {
        // Load clients data
        const clientsResult = await getClients();
        if (clientsResult.success) {
            populateClientsTable(clientsResult.data);
            updatePagination(clientsResult.data.length);
        } else {
            throw new Error('Failed to fetch clients');
        }
        
        // Hide loading state
        document.getElementById('clients-loading').classList.add('hidden');
    } catch (error) {
        console.error('Error initializing clients management:', error);
        
        // Show error message
        const errorElement = document.getElementById('clients-error');
        if (errorElement) {
            errorElement.classList.remove('hidden');
        }
        
        // Hide loading state
        document.getElementById('clients-loading').classList.add('hidden');
    }
}

// Populate clients table
function populateClientsTable(clients) {
    const tableBody = document.getElementById('clients-table-body');
    if (!tableBody) return;
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    if (clients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">لا يوجد عملاء حالياً</td></tr>';
        return;
    }
    
    // Add clients to table
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-700';
        
        // Format date
        const createdDate = client.created_at ? new Date(client.created_at).toLocaleDateString('ar-SA') : 'غير متوفر';
        
        // Determine status class
        let statusClass = 'bg-yellow-500/20 text-yellow-400';
        let statusText = 'جديد';
        
        if (client.status === 'active') {
            statusClass = 'bg-green-500/20 text-green-400';
            statusText = 'نشط';
        } else if (client.status === 'inactive') {
            statusClass = 'bg-gray-500/20 text-gray-400';
            statusText = 'غير نشط';
        }
        
        row.innerHTML = `
            <td class="py-3 px-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold ml-3">
                        ${client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                        <p class="font-medium">${client.name || 'عميل جديد'}</p>
                        <p class="text-sm text-gray-400">${client.email || 'بريد إلكتروني غير متوفر'}</p>
                    </div>
                </div>
            </td>
            <td class="py-3 px-4">${client.phone || 'غير متوفر'}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td class="py-3 px-4">${createdDate}</td>
            <td class="py-3 px-4">
                <span class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                    ${client.projects_count || 0} مشروع
                </span>
            </td>
            <td class="py-3 px-4">
                <div class="flex space-x-2 rtl:space-x-reverse">
                    <button class="text-blue-400 hover:text-blue-300" data-client-id="${client.id}" data-action="view">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-gold hover:text-gold/80" data-client-id="${client.id}" data-action="edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-400 hover:text-red-300" data-client-id="${client.id}" data-action="delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update showing count
    document.getElementById('showing-count').textContent = clients.length;
    document.getElementById('total-count').textContent = clients.length;
    
    // Add event listeners to action buttons
    addClientActionListeners();
}

// Update pagination
function updatePagination(totalItems) {
    const paginationContainer = document.getElementById('pagination-numbers');
    if (!paginationContainer) return;
    
    // Clear existing content
    paginationContainer.innerHTML = '';
    
    // Calculate number of pages (assuming 10 items per page)
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `px-3 py-1 rounded-md ${i === 1 ? 'bg-gold text-black' : 'bg-gray-800 text-gray-400 hover:text-white'}`;
        pageButton.textContent = i;
        pageButton.setAttribute('data-page', i);
        
        pageButton.addEventListener('click', function() {
            // Update active page
            document.querySelectorAll('[data-page]').forEach(btn => {
                btn.classList.remove('bg-gold', 'text-black');
                btn.classList.add('bg-gray-800', 'text-gray-400', 'hover:text-white');
            });
            this.classList.remove('bg-gray-800', 'text-gray-400', 'hover:text-white');
            this.classList.add('bg-gold', 'text-black');
            
            // Load page data
            // In a real app, you'd fetch the specific page from the server
            // For demo purposes, we'll just simulate pagination
            console.log(`Loading page ${i}`);
        });
        
        paginationContainer.appendChild(pageButton);
    }
    
    // Update prev/next buttons state
    document.getElementById('prev-page').disabled = true;
    document.getElementById('next-page').disabled = totalPages <= 1;
}

// Add event listeners to client action buttons
function addClientActionListeners() {
    // View client
    document.querySelectorAll('[data-action="view"]').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-client-id');
            viewClient(clientId);
        });
    });
    
    // Edit client
    document.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-client-id');
            editClient(clientId);
        });
    });
    
    // Delete client
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', function() {
            const clientId = this.getAttribute('data-client-id');
            showDeleteConfirmation(clientId);
        });
    });
}

// View client details
async function viewClient(clientId) {
    try {
        const { success, data } = await getClientById(clientId);
        
        if (success) {
            // In a real app, you'd show a detailed view or navigate to a details page
            alert(`
                تفاصيل العميل:
                الاسم: ${data.name || 'غير متوفر'}
                البريد الإلكتروني: ${data.email || 'غير متوفر'}
                رقم الهاتف: ${data.phone || 'غير متوفر'}
                الحالة: ${data.status || 'غير متوفر'}
                ملاحظات: ${data.notes || 'لا توجد ملاحظات'}
            `);
        } else {
            showError('تعذر تحميل بيانات العميل');
        }
    } catch (error) {
        console.error('Error viewing client:', error);
        showError('حدث خطأ أثناء تحميل بيانات العميل');
    }
}

// Edit client
async function editClient(clientId) {
    try {
        const { success, data } = await getClientById(clientId);
        
        if (success) {
            // Set form values
            document.getElementById('client-id').value = data.id;
            document.getElementById('client-name').value = data.name || '';
            document.getElementById('client-email').value = data.email || '';
            document.getElementById('client-phone').value = data.phone || '';
            document.getElementById('client-status').value = data.status || 'active';
            document.getElementById('client-notes').value = data.notes || '';
            
            // Update modal title
            document.getElementById('modal-title').textContent = 'تعديل بيانات العميل';
            
            // Show modal
            document.getElementById('client-modal').classList.remove('hidden');
        } else {
            showError('تعذر تحميل بيانات العميل');
        }
    } catch (error) {
        console.error('Error editing client:', error);
        showError('حدث خطأ أثناء تحميل بيانات العميل');
    }
}

// Show delete confirmation
function showDeleteConfirmation(clientId) {
    // Store client ID for deletion
    document.getElementById('confirm-delete').setAttribute('data-client-id', clientId);
    
    // Show delete confirmation modal
    document.getElementById('delete-modal').classList.remove('hidden');
}

// Delete client
async function deleteClientById(clientId) {
    try {
        const { success } = await deleteClient(clientId);
        
        if (success) {
            // Hide delete modal
            document.getElementById('delete-modal').classList.add('hidden');
            
            // Show success message
            showSuccess('تم حذف العميل بنجاح');
            
            // Reload clients
            initClientsManagement();
        } else {
            showError('تعذر حذف العميل');
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        showError('حدث خطأ أثناء حذف العميل');
    }
}

// Save client (create or update)
async function saveClient(formData) {
    try {
        const clientId = formData.get('client-id');
        
        // Prepare client data
        const clientData = {
            name: formData.get('client-name'),
            email: formData.get('client-email'),
            phone: formData.get('client-phone'),
            status: formData.get('client-status'),
            notes: formData.get('client-notes')
        };
        
        let result;
        
        if (clientId) {
            // Update existing client
            result = await updateClient(clientId, clientData);
        } else {
            // Create new client
            result = await createClient(clientData);
        }
        
        if (result.success) {
            // Hide modal
            document.getElementById('client-modal').classList.add('hidden');
            
            // Show success message
            showSuccess(clientId ? 'تم تحديث بيانات العميل بنجاح' : 'تم إضافة العميل بنجاح');
            
            // Reload clients
            initClientsManagement();
        } else {
            showError(clientId ? 'تعذر تحديث بيانات العميل' : 'تعذر إضافة العميل');
        }
    } catch (error) {
        console.error('Error saving client:', error);
        showError('حدث خطأ أثناء حفظ بيانات العميل');
    }
}

// Show success message
function showSuccess(message) {
    const successAlert = document.getElementById('success-alert');
    const successMessage = document.getElementById('success-message');
    
    successMessage.textContent = message;
    successAlert.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        successAlert.classList.add('hidden');
    }, 5000);
}

// Show error message
function showError(message) {
    const errorAlert = document.getElementById('error-alert');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = message;
    errorAlert.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        errorAlert.classList.add('hidden');
    }, 5000);
}

// Setup global event listeners
function setupEventListeners() {
    // Logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async function() {
            // Clear local storage
            localStorage.removeItem('vertex_user');
            
            // Try to logout from Supabase if available
            try {
                await logoutUser();
            } catch (error) {
                console.log('Local logout only');
            }
            
            // Redirect to login page
            window.location.href = '../login.html';
        });
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
        });
    }
    
    // Mobile menu close button
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    if (mobileMenuClose && sidebar) {
        mobileMenuClose.addEventListener('click', function() {
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.remove('translate-x-0');
        });
    }
    
    // Search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const searchQuery = this.querySelector('input[name="search"]').value;
            
            if (searchQuery.trim() === '') return;
            
            try {
                // Show loading state
                document.getElementById('clients-loading').classList.remove('hidden');
                
                // Search clients
                const { success, data } = await searchClients(searchQuery);
                
                // Hide loading state
                document.getElementById('clients-loading').classList.add('hidden');
                
                if (success) {
                    // Update UI with search results
                    populateClientsTable(data);
                    updatePagination(data.length);
                    
                    // Show search results message
                    showSuccess(`تم العثور على ${data.length} نتيجة للبحث عن "${searchQuery}"`);
                } else {
                    showError('تعذر إجراء البحث');
                }
            } catch (error) {
                console.error('Error searching:', error);
                showError('حدث خطأ أثناء البحث');
                
                // Hide loading state
                document.getElementById('clients-loading').classList.add('hidden');
            }
        });
    }
    
    // Add client button
    const addClientButton = document.getElementById('add-client-button');
    if (addClientButton) {
        addClientButton.addEventListener('click', function() {
            // Reset form
            document.getElementById('client-form').reset();
            document.getElementById('client-id').value = '';
            
            // Update modal title
            document.getElementById('modal-title').textContent = 'إضافة عميل جديد';
            
            // Show modal
            document.getElementById('client-modal').classList.remove('hidden');
        });
    }
    
    // Close modal button
    const closeModalButton = document.getElementById('close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            document.getElementById('client-modal').classList.add('hidden');
        });
    }
    
    // Cancel client button
    const cancelClientButton = document.getElementById('cancel-client');
    if (cancelClientButton) {
        cancelClientButton.addEventListener('click', function() {
            document.getElementById('client-modal').classList.add('hidden');
        });
    }
    
    // Client form submission
    const clientForm = document.getElementById('client-form');
    if (clientForm) {
        clientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Save client
            saveClient(formData);
        });
    }
    
    // Close delete modal button
    const closeDeleteModalButton = document.getElementById('close-delete-modal');
    if (closeDeleteModalButton) {
        closeDeleteModalButton.addEventListener('click', function() {
            document.getElementById('delete-modal').classList.add('hidden');
        });
    }
    
    // Cancel delete button
    const cancelDeleteButton = document.getElementById('cancel-delete');
    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', function() {
            document.getElementById('delete-modal').classList.add('hidden');
        });
    }
    
    // Confirm delete button
    const confirmDeleteButton = document.getElementById('confirm-delete');
    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', function() {
            const clientId = this.getAttribute('data-client-id');
            deleteClientById(clientId);
        });
    }
    
    // Apply filters button
    const applyFiltersButton = document.getElementById('apply-filters');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', async function() {
            const statusFilter = document.getElementById('status-filter').value;
            const sortFilter = document.getElementById('sort-filter').value;
            
            // Show loading state
            document.getElementById('clients-loading').classList.remove('hidden');
            
            try {
                // Get all clients
                const { success, data } = await getClients();
                
                if (success) {
                    // Filter by status
                    let filteredClients = data;
                    if (statusFilter !== 'all') {
                        filteredClients = data.filter(client => client.status === statusFilter);
                    }
                    
                    // Sort clients
                    if (sortFilter === 'newest') {
                        filteredClients.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    } else if (sortFilter === 'oldest') {
                        filteredClients.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    } else if (sortFilter === 'name') {
                        filteredClients.sort((a, b) => a.name.localeCompare(b.name));
                    }
                    
                    // Update UI
                    populateClientsTable(filteredClients);
                    updatePagination(filteredClients.length);
                    
                    // Show success message
                    showSuccess(`تم تطبيق الفلتر (${filteredClients.length} عميل)`);
                } else {
                    showError('تعذر تطبيق الفلتر');
                }
            } catch (error) {
                console.error('Error applying filters:', error);
                showError('حدث خطأ أثناء تطبيق الفلتر');
            }
            
            // Hide loading state
            document.getElementById('clients-loading').classList.add('hidden');
        });
    }
    
    // Pagination prev/next buttons
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    
    if (prevPageButton) {
        prevPageButton.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Get current active page
            const activePage = document.querySelector('[data-page].bg-gold');
            if (activePage) {
                const currentPage = parseInt(activePage.getAttribute('data-page'));
                const prevPage = document.querySelector(`[data-page="${currentPage - 1}"]`);
                
                if (prevPage) {
                    prevPage.click();
                }
            }
        });
    }
    
    if (nextPageButton) {
        nextPageButton.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Get current active page
            const activePage = document.querySelector('[data-page].bg-gold');
            if (activePage) {
                const currentPage = parseInt(activePage.getAttribute('data-page'));
                const nextPage = document.querySelector(`[data-page="${currentPage + 1}"]`);
                
                if (nextPage) {
                    nextPage.click();
                }
            }
        });
    }
}
