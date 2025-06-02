// Vertex AI PHP Backend Integration
// This file provides the PHP backend integration code for the Vertex AI website

// Database connection configuration
$db_config = [
    'host' => 'localhost',
    'username' => 'db_user',
    'password' => 'db_password',
    'database' => 'vertex_agency'
];

// User authentication functions
function authenticateUser($username, $password) {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Prepare statement
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verify password (using SHA-256 hash)
        if (hash('sha256', $password) === $user['password']) {
            return [
                'success' => true,
                'user_id' => $user['id']
            ];
        }
    }
    
    return [
        'success' => false,
        'message' => 'اسم المستخدم أو كلمة المرور غير صحيحة'
    ];
}

// Create new user
function createUser($username, $password) {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        return [
            'success' => false,
            'message' => 'اسم المستخدم موجود بالفعل'
        ];
    }
    
    // Hash password
    $hashed_password = hash('sha256', $password);
    
    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hashed_password);
    
    if ($stmt->execute()) {
        return [
            'success' => true,
            'user_id' => $conn->insert_id
        ];
    } else {
        return [
            'success' => false,
            'message' => 'فشل إنشاء المستخدم'
        ];
    }
}

// Get user data
function getUserData($user_id) {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Get user data
    $stmt = $conn->prepare("SELECT id, username, created_at FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        return [
            'success' => true,
            'user' => $user
        ];
    }
    
    return [
        'success' => false,
        'message' => 'المستخدم غير موجود'
    ];
}

// Save user preferences
function saveUserPreferences($user_id, $preferences) {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Convert preferences to JSON
    $preferences_json = json_encode($preferences);
    
    // Check if preferences already exist
    $stmt = $conn->prepare("SELECT id FROM user_preferences WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Update existing preferences
        $stmt = $conn->prepare("UPDATE user_preferences SET preferences = ? WHERE user_id = ?");
        $stmt->bind_param("si", $preferences_json, $user_id);
    } else {
        // Insert new preferences
        $stmt = $conn->prepare("INSERT INTO user_preferences (user_id, preferences) VALUES (?, ?)");
        $stmt->bind_param("is", $user_id, $preferences_json);
    }
    
    if ($stmt->execute()) {
        return [
            'success' => true
        ];
    } else {
        return [
            'success' => false,
            'message' => 'فشل حفظ التفضيلات'
        ];
    }
}

// Get user preferences
function getUserPreferences($user_id) {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Get user preferences
    $stmt = $conn->prepare("SELECT preferences FROM user_preferences WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $preferences = json_decode($row['preferences'], true);
        
        return [
            'success' => true,
            'preferences' => $preferences
        ];
    }
    
    // Return default preferences if none found
    return [
        'success' => true,
        'preferences' => [
            'theme' => 'dark',
            'language' => 'ar',
            'notifications' => true,
            'dashboardLayout' => 'default',
            'contentTone' => 'conversational',
            'contentLength' => 'medium'
        ]
    ];
}

// Save generated content
function saveGeneratedContent($user_id, $content_data) {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Insert content
    $stmt = $conn->prepare("INSERT INTO generated_content (user_id, content_type, content_topic, content_text, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("isss", $user_id, $content_data['type'], $content_data['topic'], $content_data['text']);
    
    if ($stmt->execute()) {
        return [
            'success' => true,
            'content_id' => $conn->insert_id
        ];
    } else {
        return [
            'success' => false,
            'message' => 'فشل حفظ المحتوى'
        ];
    }
}

// Get user's generated content history
function getContentHistory($user_id) {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Get content history
    $stmt = $conn->prepare("SELECT id, content_type, content_topic, created_at FROM generated_content WHERE user_id = ? ORDER BY created_at DESC LIMIT 10");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $history = [];
    while ($row = $result->fetch_assoc()) {
        $history[] = $row;
    }
    
    return [
        'success' => true,
        'history' => $history
    ];
}

// Get specific content item
function getContentItem($content_id, $user_id) {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Get content item
    $stmt = $conn->prepare("SELECT * FROM generated_content WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $content_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $content = $result->fetch_assoc();
        
        return [
            'success' => true,
            'content' => $content
        ];
    }
    
    return [
        'success' => false,
        'message' => 'المحتوى غير موجود'
    ];
}

// Save contact form submission
function saveContactSubmission($form_data) {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Insert submission
    $stmt = $conn->prepare("INSERT INTO contact_submissions (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssss", $form_data['name'], $form_data['email'], $form_data['phone'], $form_data['message']);
    
    if ($stmt->execute()) {
        return [
            'success' => true,
            'submission_id' => $conn->insert_id
        ];
    } else {
        return [
            'success' => false,
            'message' => 'فشل إرسال النموذج'
        ];
    }
}

// Database schema creation
function createDatabaseSchema() {
    global $db_config;
    
    // Connect to database
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password']);
    
    // Check connection
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات'
        ];
    }
    
    // Create database if not exists
    $sql = "CREATE DATABASE IF NOT EXISTS " . $db_config['database'];
    if (!$conn->query($sql)) {
        return [
            'success' => false,
            'message' => 'فشل إنشاء قاعدة البيانات'
        ];
    }
    
    // Select database
    $conn->select_db($db_config['database']);
    
    // Create users table
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if (!$conn->query($sql)) {
        return [
            'success' => false,
            'message' => 'فشل إنشاء جدول المستخدمين'
        ];
    }
    
    // Create user_preferences table
    $sql = "CREATE TABLE IF NOT EXISTS user_preferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        preferences TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )";
    
    if (!$conn->query($sql)) {
        return [
            'success' => false,
            'message' => 'فشل إنشاء جدول تفضيلات المستخدمين'
        ];
    }
    
    // Create generated_content table
    $sql = "CREATE TABLE IF NOT EXISTS generated_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        content_topic VARCHAR(255) NOT NULL,
        content_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )";
    
    if (!$conn->query($sql)) {
        return [
            'success' => false,
            'message' => 'فشل إنشاء جدول المحتوى المولد'
        ];
    }
    
    // Create contact_submissions table
    $sql = "CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if (!$conn->query($sql)) {
        return [
            'success' => false,
            'message' => 'فشل إنشاء جدول نماذج الاتصال'
        ];
    }
    
    // Insert default user (s7x / 2008.11.26)
    $username = 's7x';
    $password = hash('sha256', '2008.11.26');
    
    // Check if user already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // Insert default user
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password);
        
        if (!$stmt->execute()) {
            return [
                'success' => false,
                'message' => 'فشل إنشاء المستخدم الافتراضي'
            ];
        }
    }
    
    return [
        'success' => true,
        'message' => 'تم إنشاء قاعدة البيانات بنجاح'
    ];
}

// API endpoint handler
function handleApiRequest() {
    // Get request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Get request path
    $path = $_SERVER['PATH_INFO'] ?? '/';
    
    // Handle request based on method and path
    switch ($method) {
        case 'POST':
            switch ($path) {
                case '/login':
                    // Get request body
                    $data = json_decode(file_get_contents('php://input'), true);
                    
                    // Validate request
                    if (!isset($data['username']) || !isset($data['password'])) {
                        http_response_code(400);
                        echo json_encode([
                            'success' => false,
                            'message' => 'بيانات غير صالحة'
                        ]);
                        return;
                    }
                    
                    // Authenticate user
                    $result = authenticateUser($data['username'], $data['password']);
                    
                    if ($result['success']) {
                        // Start session
                        session_start();
                        $_SESSION['user_id'] = $result['user_id'];
                        $_SESSION['username'] = $data['username'];
                    }
                    
                    echo json_encode($result);
                    break;
                    
                case '/register':
                    // Get request body
                    $data = json_decode(file_get_contents('php://input'), true);
                    
                    // Validate request
                    if (!isset($data['username']) || !isset($data['password'])) {
                        http_response_code(400);
                        echo json_encode([
                            'success' => false,
                            'message' => 'بيانات غير صالحة'
                        ]);
                        return;
                    }
                    
                    // Create user
                    $result = createUser($data['username'], $data['password']);
                    
                    echo json_encode($result);
                    break;
                    
                case '/preferences':
                    // Start session
                    session_start();
                    
                    // Check if user is logged in
                    if (!isset($_SESSION['user_id'])) {
                        http_response_code(401);
                        echo json_encode([
                            'success' => false,
                            'message' => 'غير مصرح'
                        ]);
                        return;
                    }
                    
                    // Get request body
                    $data = json_decode(file_get_contents('php://input'), true);
                    
                    // Save preferences
                    $result = saveUserPreferences($_SESSION['user_id'], $data);
                    
                    echo json_encode($result);
                    break;
                    
                case '/content':
                    // Start session
                    session_start();
                    
                    // Check if user is logged in
                    if (!isset($_SESSION['user_id'])) {
                        http_response_code(401);
                        echo json_encode([
                            'success' => false,
                            'message' => 'غير مصرح'
                        ]);
                        return;
                    }
                    
                    // Get request body
                    $data = json_decode(file_get_contents('php://input'), true);
                    
                    // Save content
                    $result = saveGeneratedContent($_SESSION['user_id'], $data);
                    
                    echo json_encode($result);
                    break;
                    
                case '/contact':
                    // Get request body
                    $data = json_decode(file_get_contents('php://input'), true);
                    
                    // Validate request
                    if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
                        http_response_code(400);
                        echo json_encode([
                            'success' => false,
                            'message' => 'بيانات غير صالحة'
                        ]);
                        return;
                    }
                    
                    // Save submission
                    $result = saveContactSubmission($data);
                    
                    echo json_encode($result);
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode([
                        'success' => false,
                        'message' => 'المسار غير موجود'
                    ]);
            }
            break;
            
        case 'GET':
            switch ($path) {
                case '/user':
                    // Start session
                    session_start();
                    
                    // Check if user is logged in
                    if (!isset($_SESSION['user_id'])) {
                        http_response_code(401);
                        echo json_encode([
                            'success' => false,
                            'message' => 'غير مصرح'
                        ]);
                        return;
                    }
                    
                    // Get user data
                    $result = getUserData($_SESSION['user_id']);
                    
                    echo json_encode($result);
                    break;
                    
                case '/preferences':
                    // Start session
                    session_start();
                    
                    // Check if user is logged in
                    if (!isset($_SESSION['user_id'])) {
                        http_response_code(401);
                        echo json_encode([
                            'success' => false,
                            'message' => 'غير مصرح'
                        ]);
                        return;
                    }
                    
                    // Get preferences
                    $result = getUserPreferences($_SESSION['user_id']);
                    
                    echo json_encode($result);
                    break;
                    
                case '/content/history':
                    // Start session
                    session_start();
                    
                    // Check if user is logged in
                    if (!isset($_SESSION['user_id'])) {
                        http_response_code(401);
                        echo json_encode([
                            'success' => false,
                            'message' => 'غير مصرح'
                        ]);
                        return;
                    }
                    
                    // Get content history
                    $result = getContentHistory($_SESSION['user_id']);
                    
                    echo json_encode($result);
                    break;
                    
                case '/content':
                    // Start session
                    session_start();
                    
                    // Check if user is logged in
                    if (!isset($_SESSION['user_id'])) {
                        http_response_code(401);
                        echo json_encode([
                            'success' => false,
                            'message' => 'غير مصرح'
                        ]);
                        return;
                    }
                    
                    // Check if content ID is provided
                    if (!isset($_GET['id'])) {
                        http_response_code(400);
                        echo json_encode([
                            'success' => false,
                            'message' => 'معرف المحتوى مطلوب'
                        ]);
                        return;
                    }
                    
                    // Get content item
                    $result = getContentItem($_GET['id'], $_SESSION['user_id']);
                    
                    echo json_encode($result);
                    break;
                    
                case '/logout':
                    // Start session
                    session_start();
                    
                    // Destroy session
                    session_destroy();
                    
                    echo json_encode([
                        'success' => true
                    ]);
                    break;
                    
                case '/setup':
                    // Create database schema
                    $result = createDatabaseSchema();
                    
                    echo json_encode($result);
                    break;
                    
                default:
                    http_response_code(404);
                    echo json_encode([
                        'success' => false,
                        'message' => 'المسار غير موجود'
                    ]);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'طريقة غير مسموح بها'
            ]);
    }
}

// Set content type to JSON
header('Content-Type: application/json');

// Handle API request
handleApiRequest();
