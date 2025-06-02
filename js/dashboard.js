// Vertex AI Dashboard Core Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkLoginStatus();
    
    // Initialize dashboard components
    initializeDashboard();
    
    // Setup event listeners
    setupEventListeners();
});

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('vertexLoggedIn') === 'true';
    const username = localStorage.getItem('vertexUsername');
    
    if (isLoggedIn && username) {
        // Show dashboard
        document.getElementById('dashboard-container').style.display = 'flex';
        document.getElementById('login-redirect').style.display = 'none';
        
        // Set user information
        setUserInfo(username);
    } else {
        // Redirect to login page
        document.getElementById('dashboard-container').style.display = 'none';
        document.getElementById('login-redirect').style.display = 'flex';
    }
}

// Set user information in the dashboard
function setUserInfo(username) {
    // Set username in sidebar
    const userNameElements = document.querySelectorAll('.sidebar-user-name');
    userNameElements.forEach(element => {
        element.textContent = username;
    });
    
    // Set welcome message
    const welcomeUserElements = document.querySelectorAll('#welcome-user-name');
    welcomeUserElements.forEach(element => {
        element.textContent = username;
    });
    
    // Set user initial
    const userInitialElements = document.querySelectorAll('#user-initial');
    userInitialElements.forEach(element => {
        element.textContent = username.charAt(0).toUpperCase();
    });
}

// Initialize dashboard components
function initializeDashboard() {
    // Load user data
    loadUserData();
    
    // Initialize charts if they exist
    if (typeof initializeCharts === 'function') {
        initializeCharts();
    }
    
    // Initialize AI tools if they exist
    if (typeof initializeAITools === 'function') {
        initializeAITools();
    }
}

// Load user data from API or localStorage
function loadUserData() {
    // In a real application, this would fetch data from an API
    // For now, we'll use mock data
    
    // Get user preferences from localStorage or set defaults
    const userPreferences = JSON.parse(localStorage.getItem('vertexUserPreferences')) || {
        theme: 'dark',
        language: 'ar',
        notifications: true,
        dashboardLayout: 'default'
    };
    
    // Apply user preferences
    applyUserPreferences(userPreferences);
}

// Apply user preferences to the dashboard
function applyUserPreferences(preferences) {
    // Apply theme
    document.body.setAttribute('data-theme', preferences.theme);
    
    // Apply language
    document.documentElement.lang = preferences.language;
    document.documentElement.dir = preferences.language === 'ar' ? 'rtl' : 'ltr';
    
    // Apply dashboard layout
    if (preferences.dashboardLayout !== 'default') {
        // Custom dashboard layout logic would go here
    }
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Mobile sidebar toggle
    const sidebarClose = document.querySelector('.sidebar-close');
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
    
    // Setup other event listeners based on the current page
    setupPageSpecificListeners();
}

// Setup page-specific event listeners
function setupPageSpecificListeners() {
    // Check current page
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('ai-tools.html')) {
        setupAIToolsListeners();
    } else if (currentPath.includes('projects.html')) {
        setupProjectsListeners();
    } else if (currentPath.includes('analytics.html')) {
        setupAnalyticsListeners();
    }
}

// Setup AI Tools page listeners
function setupAIToolsListeners() {
    // Tone Options
    const toneOptions = document.querySelectorAll('.tone-option');
    if (toneOptions.length > 0) {
        toneOptions.forEach(option => {
            option.addEventListener('click', function() {
                toneOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Length Options
    const lengthOptions = document.querySelectorAll('.length-option');
    if (lengthOptions.length > 0) {
        lengthOptions.forEach(option => {
            option.addEventListener('click', function() {
                lengthOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Template Selection
    const templateItems = document.querySelectorAll('.template-item');
    if (templateItems.length > 0) {
        templateItems.forEach(item => {
            item.addEventListener('click', function() {
                const template = this.getAttribute('data-template');
                applyTemplate(template);
            });
        });
    }

    // Generate Content Button
    const generateBtn = document.getElementById('generate-content');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateContent();
        });
    }

    // Copy Content Button
    const copyBtn = document.querySelector('.content-preview-action[title="نسخ"]');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyContent();
        });
    }
}

// Apply template to the content form
function applyTemplate(template) {
    // Get form elements
    const contentType = document.getElementById('content-type');
    const contentTopic = document.getElementById('content-topic');
    const contentKeywords = document.getElementById('content-keywords');
    
    // Apply template based on selection
    switch(template) {
        case 'blog-tech':
            contentType.value = 'blog';
            contentTopic.value = 'أحدث تقنيات الذكاء الاصطناعي';
            contentKeywords.value = 'ذكاء اصطناعي، تقنية، ابتكار، مستقبل';
            document.querySelector('.tone-option[data-tone="professional"]').click();
            document.querySelector('.length-option[data-length="long"]').click();
            break;
        case 'social-promo':
            contentType.value = 'social';
            contentTopic.value = 'الترويج لخدمات الذكاء الاصطناعي';
            contentKeywords.value = 'عرض، خصم، ذكاء اصطناعي، تطوير الأعمال';
            document.querySelector('.tone-option[data-tone="persuasive"]').click();
            document.querySelector('.length-option[data-length="short"]').click();
            break;
        case 'email-newsletter':
            contentType.value = 'email';
            contentTopic.value = 'نشرة إخبارية شهرية عن تطورات الذكاء الاصطناعي';
            contentKeywords.value = 'أخبار، تحديثات، ذكاء اصطناعي، تقنية';
            document.querySelector('.tone-option[data-tone="conversational"]').click();
            document.querySelector('.length-option[data-length="medium"]').click();
            break;
        case 'product-description':
            contentType.value = 'product';
            contentTopic.value = 'وصف نظام ذكي لإدارة المشاريع';
            contentKeywords.value = 'إدارة مشاريع، ذكاء اصطناعي، إنتاجية، كفاءة';
            document.querySelector('.tone-option[data-tone="persuasive"]').click();
            document.querySelector('.length-option[data-length="medium"]').click();
            break;
        case 'ad-copy':
            contentType.value = 'ad';
            contentTopic.value = 'إعلان عن خدمات الذكاء الاصطناعي';
            contentKeywords.value = 'ذكاء اصطناعي، تطوير الأعمال، نمو، تحسين';
            document.querySelector('.tone-option[data-tone="persuasive"]').click();
            document.querySelector('.length-option[data-length="short"]').click();
            break;
    }
}

// Generate content based on form inputs
function generateContent() {
    // Get form values
    const contentType = document.getElementById('content-type').value;
    const contentTopic = document.getElementById('content-topic').value;
    const contentKeywords = document.getElementById('content-keywords').value;
    const contentInstructions = document.getElementById('content-instructions').value;
    const contentTone = document.querySelector('.tone-option.active').getAttribute('data-tone');
    const contentLength = document.querySelector('.length-option.active').getAttribute('data-length');
    
    // Validate inputs
    if (!contentTopic) {
        alert('يرجى إدخال موضوع المحتوى');
        return;
    }
    
    // Show preview and loading spinner
    document.getElementById('content-preview').style.display = 'block';
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('content-text').innerHTML = '';
    
    // In a real application, this would call an API
    // For now, we'll simulate a delay and return mock content
    setTimeout(function() {
        document.getElementById('loading-spinner').style.display = 'none';
        
        // Generate content based on type
        let generatedContent = '';
        
        switch(contentType) {
            case 'blog':
                generatedContent = generateBlogContent(contentTopic, contentTone, contentLength);
                break;
            case 'social':
                generatedContent = generateSocialContent(contentTopic, contentTone, contentLength);
                break;
            case 'email':
                generatedContent = generateEmailContent(contentTopic, contentTone, contentLength);
                break;
            case 'ad':
                generatedContent = generateAdContent(contentTopic, contentTone, contentLength);
                break;
            case 'product':
                generatedContent = generateProductContent(contentTopic, contentTone, contentLength);
                break;
        }
        
        // Display generated content
        document.getElementById('content-text').innerHTML = generatedContent;
        
        // Scroll to preview
        document.getElementById('content-preview').scrollIntoView({ behavior: 'smooth' });
        
        // Save to history
        saveContentToHistory(contentType, contentTopic);
    }, 2000);
}

// Generate blog content
function generateBlogContent(topic, tone, length) {
    // In a real application, this would use an AI API
    return `
        <h3>${topic}</h3>
        <p>في عالم يتطور بسرعة كبيرة، أصبح الذكاء الاصطناعي أحد أهم التقنيات التي تشكل مستقبل الأعمال والصناعات المختلفة. تقدم هذه التقنية فرصاً هائلة للشركات لتحسين عملياتها وزيادة كفاءتها وتقديم تجارب أفضل لعملائها.</p>
        <p>من خلال الاستفادة من قوة الذكاء الاصطناعي، يمكن للشركات تحليل كميات هائلة من البيانات واستخراج رؤى قيمة تساعدها على اتخاذ قرارات أفضل وأكثر ذكاءً. كما يمكن للذكاء الاصطناعي أتمتة العمليات المتكررة وتوفير الوقت والجهد، مما يسمح للموظفين بالتركيز على المهام الأكثر أهمية وإبداعاً.</p>
        <p>في هذا المقال، سنستكشف كيف يمكن للشركات الاستفادة من تقنيات الذكاء الاصطناعي لتعزيز نموها وتحقيق ميزة تنافسية في السوق.</p>
    `;
}

// Generate social media content
function generateSocialContent(topic, tone, length) {
    return `
        <h3>🚀 أطلق العنان لإمكانيات مشروعك مع Vertex AI!</h3>
        <p>هل تبحث عن طريقة لتعزيز نمو مشروعك وزيادة كفاءته؟ نظام Vertex AI الذكي هو الحل الأمثل لك! استفد من قوة الذكاء الاصطناعي لتحليل بياناتك، أتمتة عملياتك، وتحسين تجربة عملائك.</p>
        <p>احصل على تجربة مجانية لمدة 7 أيام واكتشف كيف يمكن لنظام Vertex AI الذكي تغيير طريقة عملك للأفضل! 💯</p>
        <p>#VertexAI #ذكاء_اصطناعي #تطوير_الأعمال</p>
    `;
}

// Generate email content
function generateEmailContent(topic, tone, length) {
    return `
        <h3>نشرة Vertex AI الشهرية - يونيو 2025</h3>
        <p>مرحباً بك في نشرة Vertex AI الشهرية!</p>
        <p>نأمل أن تكون بخير وأن يكون مشروعك في تقدم مستمر. في هذا الشهر، لدينا العديد من التحديثات والأخبار المثيرة لمشاركتها معك:</p>
        <ul>
            <li>أطلقنا أداة جديدة لتوليد المحتوى الذكي تساعدك على إنشاء محتوى عالي الجودة بسرعة وسهولة.</li>
            <li>قمنا بتحسين نظام التحليلات لتوفير رؤى أكثر دقة وعمقاً حول أداء مشروعك.</li>
            <li>أضفنا المزيد من القوالب الجاهزة لمساعدتك على بدء مشاريعك بسرعة أكبر.</li>
        </ul>
        <p>لا تتردد في التواصل معنا إذا كان لديك أي أسئلة أو استفسارات. نحن هنا لمساعدتك!</p>
        <p>مع أطيب التحيات،<br>فريق Vertex AI</p>
    `;
}

// Generate ad content
function generateAdContent(topic, tone, length) {
    return `
        <h3>حول مشروعك إلى نظام ذكي مع Vertex AI!</h3>
        <p>🔥 عرض خاص: احصل على خصم 20% عند الاشتراك في باقة Pro لمدة سنة! 🔥</p>
        <p>لا تفوت هذه الفرصة لتعزيز نمو مشروعك وزيادة أرباحك. اشترك الآن!</p>
    `;
}

// Generate product description content
function generateProductContent(topic, tone, length) {
    return `
        <h3>نظام Vertex AI الذكي لإدارة المشاريع</h3>
        <p>نظام متكامل يجمع بين قوة الذكاء الاصطناعي وسهولة الاستخدام لمساعدتك على إدارة مشاريعك بكفاءة وفعالية غير مسبوقة.</p>
        <p>المميزات الرئيسية:</p>
        <ul>
            <li>لوحة تحكم ذكية مخصصة حسب احتياجاتك</li>
            <li>أدوات ذكاء اصطناعي متكاملة لتحليل البيانات واتخاذ القرارات</li>
            <li>نظام أتمتة متقدم لتوفير الوقت والجهد</li>
            <li>تقارير وتحليلات مفصلة لمتابعة أداء مشروعك</li>
            <li>دعم فني على مدار الساعة</li>
        </ul>
        <p>مع نظام Vertex AI الذكي، ستتمكن من تحقيق أهدافك بسرعة وكفاءة أكبر، وستوفر الوقت والجهد لتركز على تطوير مشروعك وتحقيق النجاح.</p>
    `;
}

// Save content to history
function saveContentToHistory(type, topic) {
    // In a real application, this would save to a database
    // For now, we'll just add it to the UI
    
    const historyList = document.querySelector('.history-list');
    if (!historyList) return;
    
    const today = new Date();
    const dateString = today.toLocaleDateString('ar-SA');
    
    const typeMap = {
        'blog': 'مقال مدونة',
        'social': 'منشور وسائل التواصل الاجتماعي',
        'email': 'رسالة بريد إلكتروني',
        'ad': 'إعلان',
        'product': 'وصف منتج'
    };
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-item-header">
            <div>
                <h3 class="history-item-title">${topic}</h3>
                <div class="history-item-meta">
                    <span>${typeMap[type]}</span> • <span>${dateString}</span>
                </div>
            </div>
            <div class="history-item-actions">
                <div class="history-item-action" title="عرض">
                    <i class="fas fa-eye"></i>
                </div>
                <div class="history-item-action" title="تحرير">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="history-item-action" title="حذف">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        </div>
    `;
    
    // Add to the beginning of the list
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// Copy content to clipboard
function copyContent() {
    const contentText = document.getElementById('content-text').innerText;
    
    navigator.clipboard.writeText(contentText).then(function() {
        showNotification('تم نسخ المحتوى بنجاح!');
    }, function() {
        showNotification('فشل نسخ المحتوى', 'error');
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Logout function
function logout() {
    // Remove login data
    localStorage.removeItem('vertexLoggedIn');
    localStorage.removeItem('vertexUsername');
    
    // Redirect to login page
    window.location.href = '../login.html';
}
