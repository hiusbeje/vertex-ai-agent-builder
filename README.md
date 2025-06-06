# Vertex AI Agent Builder

## نظرة عامة
Vertex AI Agent Builder هو منصة متكاملة لإنشاء وإدارة وكلاء الذكاء الاصطناعي. المشروع يقدم واجهة مستخدم احترافية مع لوحة تحكم ذكية تتيح للعملاء إدارة مشاريعهم واستخدام أدوات الذكاء الاصطناعي بسهولة.

## المميزات الرئيسية
- واجهة مستخدم عصرية بألوان ذهبية وأسود فحمي
- نظام تسجيل دخول آمن
- لوحة تحكم ذكية مع إحصائيات وتحليلات
- أدوات ذكاء اصطناعي متكاملة
- صفحة باقات وتسعير
- تكامل مع قاعدة بيانات

## هيكل المشروع
- `index.html` - الصفحة الرئيسية
- `login.html` - صفحة تسجيل الدخول
- `pricing.html` - صفحة الباقات والتسعير
- `dashboard/` - ملفات لوحة التحكم
- `api/` - ملفات واجهة برمجة التطبيقات
- `js/` - ملفات جافاسكريبت
- `css/` - ملفات التنسيق
- `images/` - الصور والشعارات

## بيانات الدخول الافتراضية
- اسم المستخدم: `s7x`
- كلمة المرور: `2008.11.26`

## خطة العمل المستقبلية
1. تطوير نظام متكامل باستخدام Node.js + Express + Supabase
2. إضافة وظائف CRUD كاملة (إضافة، قراءة، تحديث، حذف)
3. دمج أدوات الذكاء الاصطناعي مثل Flowise و LangChainJS
4. تطوير واجهة مستخدم احترافية باستخدام Tailwind CSS

## التثبيت والاستخدام
1. قم بتنزيل أو استنساخ المستودع
2. قم بإعداد قاعدة بيانات Supabase وتحديث ملف التكوين في `api/config/config.php`
3. قم بتحميل الملفات على خادم الويب الخاص بك
4. قم بزيارة `/api/setup` لإعداد قاعدة البيانات تلقائياً
5. استخدم بيانات الدخول الافتراضية للوصول إلى لوحة التحكم

## المتطلبات
- خادم ويب يدعم PHP 7.4+
- قاعدة بيانات MySQL أو PostgreSQL
- اتصال بالإنترنت للوصول إلى واجهات برمجة التطبيقات الخارجية

## الترخيص
جميع الحقوق محفوظة © Vertex Solutions 2025
