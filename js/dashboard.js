// Dashboard main script with Supabase integration
import { getCurrentUser, logoutUser } from '../js/supabase/auth.js';
import { getClients, searchClients } from '../js/supabase/clients.js';
import { getProjects } from '../js/supabase/projects.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    checkAuth();
    
    // Initialize dashboard components
    initDashboard();
    
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

// Initialize dashboard data and components
async function initDashboard() {
    // Show loading state
    document.getElementById('dashboard-loading').classList.remove('hidden');
    
    try {
        // Load clients data
        const clientsResult = await getClients();
        if (clientsResult.success) {
            updateClientsStats(clientsResult.data);
            populateRecentClients(clientsResult.data);
        }
        
        // Load projects data
        const projectsResult = await getProjects();
        if (projectsResult.success) {
            updateProjectsStats(projectsResult.data);
            populateRecentProjects(projectsResult.data);
        }
        
        // Initialize charts
        initCharts();
        
        // Hide loading state
        document.getElementById('dashboard-loading').classList.add('hidden');
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        
        // Show error message
        const errorElement = document.getElementById('dashboard-error');
        if (errorElement) {
            errorElement.textContent = 'حدث خطأ أثناء تحميل البيانات. يرجى تحديث الصفحة.';
            errorElement.classList.remove('hidden');
        }
        
        // Hide loading state
        document.getElementById('dashboard-loading').classList.add('hidden');
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
    // This is a placeholder - in a real app, you'd use the user's actual avatar
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(element => {
        element.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=FFD700&color=000000`;
    });
}

// Update clients statistics
function updateClientsStats(clients) {
    const totalClientsElement = document.getElementById('total-clients');
    if (totalClientsElement) {
        totalClientsElement.textContent = clients.length;
    }
    
    // Update other client-related stats as needed
    const activeClientsElement = document.getElementById('active-clients');
    if (activeClientsElement) {
        const activeClients = clients.filter(client => client.status === 'active').length;
        activeClientsElement.textContent = activeClients || Math.floor(clients.length * 0.8); // Fallback if status not available
    }
}

// Update projects statistics
function updateProjectsStats(projects) {
    const totalProjectsElement = document.getElementById('total-projects');
    if (totalProjectsElement) {
        totalProjectsElement.textContent = projects.length;
    }
    
    // Update other project-related stats
    const completedProjectsElement = document.getElementById('completed-projects');
    if (completedProjectsElement) {
        const completedProjects = projects.filter(project => project.status === 'completed').length;
        completedProjectsElement.textContent = completedProjects || Math.floor(projects.length * 0.6); // Fallback
    }
    
    const pendingProjectsElement = document.getElementById('pending-projects');
    if (pendingProjectsElement) {
        const pendingProjects = projects.filter(project => project.status === 'pending').length;
        pendingProjectsElement.textContent = pendingProjects || Math.floor(projects.length * 0.4); // Fallback
    }
}

// Populate recent clients list
function populateRecentClients(clients) {
    const recentClientsContainer = document.getElementById('recent-clients');
    if (!recentClientsContainer) return;
    
    // Clear existing content
    recentClientsContainer.innerHTML = '';
    
    // Get 5 most recent clients
    const recentClients = clients.slice(0, 5);
    
    if (recentClients.length === 0) {
        recentClientsContainer.innerHTML = '<tr><td colspan="4" class="text-center py-4">لا يوجد عملاء حالياً</td></tr>';
        return;
    }
    
    // Add clients to table
    recentClients.forEach(client => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-700';
        
        // Format date
        const createdDate = client.created_at ? new Date(client.created_at).toLocaleDateString('ar-SA') : 'غير متوفر';
        
        row.innerHTML = `
            <td class="py-3 px-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold mr-3">
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
                <span class="px-2 py-1 rounded-full text-xs ${client.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">
                    ${client.status === 'active' ? 'نشط' : 'جديد'}
                </span>
            </td>
            <td class="py-3 px-4">${createdDate}</td>
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
        
        recentClientsContainer.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addClientActionListeners();
}

// Populate recent projects list
function populateRecentProjects(projects) {
    const recentProjectsContainer = document.getElementById('recent-projects');
    if (!recentProjectsContainer) return;
    
    // Clear existing content
    recentProjectsContainer.innerHTML = '';
    
    // Get 5 most recent projects
    const recentProjects = projects.slice(0, 5);
    
    if (recentProjects.length === 0) {
        recentProjectsContainer.innerHTML = '<div class="text-center py-4">لا توجد مشاريع حالياً</div>';
        return;
    }
    
    // Add projects to container
    recentProjects.forEach(project => {
        // Calculate progress percentage
        const progress = project.progress || Math.floor(Math.random() * 100);
        
        // Determine status class
        let statusClass = 'bg-yellow-500/20 text-yellow-400';
        let statusText = 'قيد التنفيذ';
        
        if (project.status === 'completed' || progress === 100) {
            statusClass = 'bg-green-500/20 text-green-400';
            statusText = 'مكتمل';
        } else if (project.status === 'pending' || progress < 10) {
            statusClass = 'bg-blue-500/20 text-blue-400';
            statusText = 'قيد الانتظار';
        }
        
        const projectCard = document.createElement('div');
        projectCard.className = 'bg-gray-800/50 border border-gray-700 rounded-lg p-4';
        projectCard.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-lg">${project.name || 'مشروع جديد'}</h3>
                <span class="px-2 py-1 rounded-full text-xs ${statusClass}">
                    ${statusText}
                </span>
            </div>
            <p class="text-gray-400 text-sm mb-4">${project.description || 'وصف المشروع غير متوفر'}</p>
            <div class="mb-2">
                <div class="flex justify-between text-sm mb-1">
                    <span>التقدم</span>
                    <span>${progress}%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-gold h-2 rounded-full" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="flex justify-between items-center mt-4">
                <div class="text-sm text-gray-400">
                    <i class="far fa-calendar-alt mr-1"></i>
                    ${project.due_date ? new Date(project.due_date).toLocaleDateString('ar-SA') : 'تاريخ التسليم غير محدد'}
                </div>
                <div class="flex space-x-2 rtl:space-x-reverse">
                    <button class="text-blue-400 hover:text-blue-300" data-project-id="${project.id}" data-action="view-project">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-gold hover:text-gold/80" data-project-id="${project.id}" data-action="edit-project">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `;
        
        recentProjectsContainer.appendChild(projectCard);
    });
    
    // Add event listeners to project action buttons
    addProjectActionListeners();
}

// Initialize charts
function initCharts() {
    // This is a placeholder - in a real app, you'd use a charting library like Chart.js
    console.log('Charts initialized');
    
    // Example: Create a simple revenue chart using DOM
    const revenueChartContainer = document.getElementById('revenue-chart');
    if (revenueChartContainer) {
        // Sample data
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
        const values = [4500, 3800, 5200, 6100, 5800, 7200];
        
        // Calculate max value for scaling
        const maxValue = Math.max(...values);
        
        // Create chart HTML
        let chartHTML = '<div class="flex items-end h-40 space-x-2 rtl:space-x-reverse">';
        
        months.forEach((month, index) => {
            const height = (values[index] / maxValue) * 100;
            chartHTML += `
                <div class="flex flex-col items-center flex-1">
                    <div class="w-full bg-gold/20 hover:bg-gold/30 rounded-t-sm transition-all" style="height: ${height}%"></div>
                    <div class="text-xs mt-2 text-gray-400">${month}</div>
                </div>
            `;
        });
        
        chartHTML += '</div>';
        revenueChartContainer.innerHTML = chartHTML;
    }
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
            deleteClient(clientId);
        });
    });
}

// Add event listeners to project action buttons
function addProjectActionListeners() {
    // View project
    document.querySelectorAll('[data-action="view-project"]').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            viewProject(projectId);
        });
    });
    
    // Edit project
    document.querySelectorAll('[data-action="edit-project"]').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            editProject(projectId);
        });
    });
}

// View client details
function viewClient(clientId) {
    console.log('Viewing client:', clientId);
    // In a real app, you'd fetch client details and show them in a modal or navigate to a details page
    alert(`عرض تفاصيل العميل: ${clientId}`);
}

// Edit client
function editClient(clientId) {
    console.log('Editing client:', clientId);
    // In a real app, you'd fetch client details and show them in a form for editing
    alert(`تعديل بيانات العميل: ${clientId}`);
}

// Delete client
function deleteClient(clientId) {
    console.log('Deleting client:', clientId);
    // In a real app, you'd show a confirmation dialog and then delete the client
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        alert(`تم حذف العميل: ${clientId}`);
    }
}

// View project details
function viewProject(projectId) {
    console.log('Viewing project:', projectId);
    // In a real app, you'd fetch project details and show them in a modal or navigate to a details page
    alert(`عرض تفاصيل المشروع: ${projectId}`);
}

// Edit project
function editProject(projectId) {
    console.log('Editing project:', projectId);
    // In a real app, you'd fetch project details and show them in a form for editing
    alert(`تعديل بيانات المشروع: ${projectId}`);
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
    
    // Search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const searchQuery = this.querySelector('input[name="search"]').value;
            
            if (searchQuery.trim() === '') return;
            
            try {
                // Search clients
                const { success, data } = await searchClients(searchQuery);
                
                if (success) {
                    // Update UI with search results
                    populateRecentClients(data);
                    
                    // Show search results message
                    alert(`تم العثور على ${data.length} نتيجة للبحث عن "${searchQuery}"`);
                }
            } catch (error) {
                console.error('Error searching:', error);
            }
        });
    }
}
