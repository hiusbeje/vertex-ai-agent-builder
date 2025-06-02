// Vertex AI Tools Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AI tools if we're on the AI tools page
    if (document.querySelector('.ai-content-generator')) {
        initializeAITools();
    }
});

// Initialize AI tools
function initializeAITools() {
    // Setup AI tools components
    setupContentGenerator();
    setupImageGenerator();
    setupChatAssistant();
    
    // Load user preferences for AI tools
    loadAIToolsPreferences();
}

// Setup content generator
function setupContentGenerator() {
    // Setup tone options
    const toneOptions = document.querySelectorAll('.tone-option');
    if (toneOptions.length > 0) {
        toneOptions.forEach(option => {
            option.addEventListener('click', function() {
                toneOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Save preference
                saveUserPreference('contentTone', this.getAttribute('data-tone'));
            });
        });
    }

    // Setup length options
    const lengthOptions = document.querySelectorAll('.length-option');
    if (lengthOptions.length > 0) {
        lengthOptions.forEach(option => {
            option.addEventListener('click', function() {
                lengthOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Save preference
                saveUserPreference('contentLength', this.getAttribute('data-length'));
            });
        });
    }

    // Setup template selection
    const templateItems = document.querySelectorAll('.template-item');
    if (templateItems.length > 0) {
        templateItems.forEach(item => {
            item.addEventListener('click', function() {
                const template = this.getAttribute('data-template');
                applyTemplate(template);
            });
        });
    }

    // Setup generate button
    const generateBtn = document.getElementById('generate-content');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateContent();
        });
    }

    // Setup copy button
    const copyBtn = document.querySelector('.content-preview-action[title="نسخ"]');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyContent();
        });
    }
    
    // Setup edit button
    const editBtn = document.querySelector('.content-preview-action[title="تحرير"]');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            editContent();
        });
    }
    
    // Setup download button
    const downloadBtn = document.querySelector('.content-preview-action[title="تنزيل"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            downloadContent();
        });
    }
}

// Setup image generator
function setupImageGenerator() {
    // This would be implemented in a real application
    console.log('Image generator setup');
}

// Setup chat assistant
function setupChatAssistant() {
    // This would be implemented in a real application
    console.log('Chat assistant setup');
}

// Load AI tools preferences
function loadAIToolsPreferences() {
    // Get user preferences from localStorage or set defaults
    const userPreferences = JSON.parse(localStorage.getItem('vertexUserPreferences')) || {
        contentTone: 'conversational',
        contentLength: 'medium',
        lastUsedTemplate: null,
        recentTopics: []
    };
    
    // Apply preferences
    applyAIToolsPreferences(userPreferences);
}

// Apply AI tools preferences
function applyAIToolsPreferences(preferences) {
    // Apply tone preference
    const toneOption = document.querySelector(`.tone-option[data-tone="${preferences.contentTone}"]`);
    if (toneOption) {
        document.querySelectorAll('.tone-option').forEach(opt => opt.classList.remove('active'));
        toneOption.classList.add('active');
    }
    
    // Apply length preference
    const lengthOption = document.querySelector(`.length-option[data-length="${preferences.contentLength}"]`);
    if (lengthOption) {
        document.querySelectorAll('.length-option').forEach(opt => opt.classList.remove('active'));
        lengthOption.classList.add('active');
    }
    
    // Apply last used template if available
    if (preferences.lastUsedTemplate) {
        const templateItem = document.querySelector(`.template-item[data-template="${preferences.lastUsedTemplate}"]`);
        if (templateItem) {
            templateItem.click();
        }
    }
    
    // Populate recent topics if available
    if (preferences.recentTopics && preferences.recentTopics.length > 0) {
        // This would populate a recent topics dropdown in a real application
    }
}

// Save user preference
function saveUserPreference(key, value) {
    // Get current preferences
    const userPreferences = JSON.parse(localStorage.getItem('vertexUserPreferences')) || {};
    
    // Update preference
    userPreferences[key] = value;
    
    // Save preferences
    localStorage.setItem('vertexUserPreferences', JSON.stringify(userPreferences));
}

// Apply template to content form
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
    
    // Save last used template
    saveUserPreference('lastUsedTemplate', template);
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
        showNotification('يرجى إدخال موضوع المحتوى', 'error');
        return;
    }
    
    // Show preview and loading spinner
    document.getElementById('content-preview').style.display = 'block';
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('content-text').innerHTML = '';
    
    // Save recent topic
    saveRecentTopic(contentTopic);
    
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
        
        // Show success notification
        showNotification('تم توليد المحتوى بنجاح!');
    }, 2000);
}

// Save recent topic
function saveRecentTopic(topic) {
    // Get current preferences
    const userPreferences = JSON.parse(localStorage.getItem('vertexUserPreferences')) || {};
    
    // Initialize recent topics if not exists
    if (!userPreferences.recentTopics) {
        userPreferences.recentTopics = [];
    }
    
    // Add topic to recent topics if not already exists
    if (!userPreferences.recentTopics.includes(topic)) {
        // Add to beginning of array
        userPreferences.recentTopics.unshift(topic);
        
        // Limit to 5 recent topics
        if (userPreferences.recentTopics.length > 5) {
            userPreferences.recentTopics.pop();
        }
        
        // Save preferences
        localStorage.setItem('vertexUserPreferences', JSON.stringify(userPreferences));
    }
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

// Edit content
function editContent() {
    const contentText = document.getElementById('content-text');
    
    // Make content editable
    contentText.contentEditable = true;
    contentText.focus();
    
    // Add editing class
    contentText.classList.add('editing');
    
    // Show save button
    const editBtn = document.querySelector('.content-preview-action[title="تحرير"]');
    editBtn.innerHTML = '<i class="fas fa-save"></i>';
    editBtn.setAttribute('title', 'حفظ');
    
    // Change click handler
    editBtn.onclick = function() {
        // Make content non-editable
        contentText.contentEditable = false;
        
        // Remove editing class
        contentText.classList.remove('editing');
        
        // Restore edit button
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.setAttribute('title', 'تحرير');
        
        // Restore click handler
        editBtn.onclick = editContent;
        
        // Show success notification
        showNotification('تم حفظ التغييرات بنجاح!');
    };
}

// Download content
function downloadContent() {
    const contentText = document.getElementById('content-text').innerText;
    const contentType = document.getElementById('content-type').value;
    const contentTopic = document.getElementById('content-topic').value;
    
    // Create file name
    const fileName = contentTopic.replace(/[^a-z0-9\u0600-\u06FF]/gi, '_').substring(0, 30) + '.txt';
    
    // Create blob
    const blob = new Blob([contentText], { type: 'text/plain' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification
    showNotification('تم تنزيل المحتوى بنجاح!');
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = `notification ${type}`;
        document.body.appendChild(notification);
    } else {
        notification.className = `notification ${type}`;
    }
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
