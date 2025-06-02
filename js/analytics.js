// Vertex AI Analytics and Charts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts if we're on the dashboard page
    if (document.querySelector('.stats-grid')) {
        initializeCharts();
    }
});

// Initialize dashboard charts
function initializeCharts() {
    // In a real application, this would fetch data from an API
    // For now, we'll use mock data
    
    // Setup charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        setupVisitorsChart();
        setupConversionChart();
        setupRevenueChart();
    } else {
        console.log('Chart.js not loaded. Charts will not be displayed.');
    }
    
    // Update stats counters with animation
    animateStatCounters();
}

// Setup visitors chart
function setupVisitorsChart() {
    const ctx = document.getElementById('visitors-chart');
    if (!ctx) return;
    
    const visitorsData = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
            label: 'الزيارات',
            data: [450, 600, 750, 800, 950, 1254],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: visitorsData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
}

// Setup conversion chart
function setupConversionChart() {
    const ctx = document.getElementById('conversion-chart');
    if (!ctx) return;
    
    const conversionData = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
            label: 'التحويلات',
            data: [12, 19, 25, 29, 35, 42],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: conversionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
}

// Setup revenue chart
function setupRevenueChart() {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    const revenueData = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
            label: 'الإيرادات',
            data: [1500, 2500, 3800, 5200, 7000, 8540],
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            borderColor: 'rgba(139, 92, 246, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: revenueData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('ar-SA', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
}

// Animate stat counters
function animateStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(statValue => {
        const finalValue = statValue.textContent;
        let startValue = 0;
        
        // Check if the value is a number or currency
        if (finalValue.includes('$')) {
            // Currency value
            const numericValue = parseFloat(finalValue.replace('$', '').replace(',', ''));
            const duration = 1500;
            const increment = numericValue / (duration / 20);
            
            const timer = setInterval(() => {
                startValue += increment;
                if (startValue >= numericValue) {
                    clearInterval(timer);
                    startValue = numericValue;
                }
                statValue.textContent = '$' + Math.floor(startValue).toLocaleString();
            }, 20);
        } else if (finalValue.includes('%')) {
            // Percentage value
            const numericValue = parseFloat(finalValue.replace('%', ''));
            const duration = 1500;
            const increment = numericValue / (duration / 20);
            
            const timer = setInterval(() => {
                startValue += increment;
                if (startValue >= numericValue) {
                    clearInterval(timer);
                    startValue = numericValue;
                }
                statValue.textContent = Math.floor(startValue) + '%';
            }, 20);
        } else {
            // Numeric value
            const numericValue = parseFloat(finalValue.replace(',', ''));
            const duration = 1500;
            const increment = numericValue / (duration / 20);
            
            const timer = setInterval(() => {
                startValue += increment;
                if (startValue >= numericValue) {
                    clearInterval(timer);
                    startValue = numericValue;
                }
                statValue.textContent = Math.floor(startValue).toLocaleString();
            }, 20);
        }
    });
}

// Update dashboard data periodically
function setupDataRefresh() {
    // In a real application, this would fetch fresh data from an API
    setInterval(() => {
        // Refresh data
        refreshDashboardData();
    }, 60000); // Refresh every minute
}

// Refresh dashboard data
function refreshDashboardData() {
    // In a real application, this would fetch fresh data from an API
    console.log('Refreshing dashboard data...');
    
    // For now, we'll just simulate data changes
    const visitorsChange = Math.floor(Math.random() * 10) - 5; // Random change between -5 and +5
    const conversionsChange = Math.floor(Math.random() * 3) - 1; // Random change between -1 and +2
    const revenueChange = Math.floor(Math.random() * 200) - 50; // Random change between -50 and +150
    
    // Update stats if they exist
    updateStatIfExists('visitors-stat', visitorsChange);
    updateStatIfExists('conversions-stat', conversionsChange);
    updateStatIfExists('revenue-stat', revenueChange);
}

// Update a stat value if the element exists
function updateStatIfExists(statId, change) {
    const statElement = document.getElementById(statId);
    if (!statElement) return;
    
    const currentValue = parseFloat(statElement.getAttribute('data-value') || '0');
    const newValue = currentValue + change;
    
    // Update the attribute
    statElement.setAttribute('data-value', newValue);
    
    // Update the displayed value
    if (statId === 'revenue-stat') {
        statElement.textContent = '$' + newValue.toLocaleString();
    } else {
        statElement.textContent = newValue.toLocaleString();
    }
    
    // Update the change indicator
    const changeElement = statElement.parentElement.querySelector('.stat-change');
    if (changeElement) {
        if (change > 0) {
            changeElement.className = 'stat-change positive';
            changeElement.innerHTML = `<span>+${(change / currentValue * 100).toFixed(1)}%</span><i class="fas fa-arrow-up"></i>`;
        } else if (change < 0) {
            changeElement.className = 'stat-change negative';
            changeElement.innerHTML = `<span>${(change / currentValue * 100).toFixed(1)}%</span><i class="fas fa-arrow-down"></i>`;
        }
    }
}
