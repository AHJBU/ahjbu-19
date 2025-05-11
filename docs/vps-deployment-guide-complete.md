
# دليل تثبيت التطبيق على VPS مع تكامل MySQL

هذا الدليل يقدم خطوات تفصيلية لتثبيت التطبيق على خادم VPS مع تكامل قاعدة بيانات MySQL.

## المتطلبات الأساسية

- خادم VPS يعمل بنظام Ubuntu 20.04 أو أعلى
- صلاحيات root أو مستخدم لديه صلاحيات sudo
- نطاق (ahjbu.com) يشير إلى خادمك
- عنوان IP للخادم: 84.46.240.246

## الخطوة 1: الاتصال بالخادم

```bash
ssh root@84.46.240.246
```

## الخطوة 2: تحديث النظام وتثبيت البرامج الأساسية

```bash
# تحديث قائمة الحزم وترقية النظام
apt update
apt upgrade -y

# تثبيت البرمجيات الأساسية
apt install -y curl git build-essential nginx

# تثبيت Node.js باستخدام NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# التحقق من التثبيت
node -v
npm -v
```

## الخطوة 3: تثبيت وإعداد MySQL

```bash
# تثبيت خادم MySQL
apt install -y mysql-server

# تأمين تثبيت MySQL
mysql_secure_installation
# اتبع التعليمات لتعيين كلمة مرور للجذر وإزالة بيانات الاختبار

# الدخول إلى MySQL
mysql -u root -p

# إنشاء قاعدة بيانات ومستخدم
CREATE DATABASE ahjbu_ah_db;
CREATE USER 'ahjbu_ah_user'@'localhost' IDENTIFIED BY 'BASem1462015%';
GRANT ALL PRIVILEGES ON ahjbu_ah_db.* TO 'ahjbu_ah_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# التحقق من الاتصال
mysql -h localhost -u ahjbu_ah_user -p'BASem1462015%' -e "SELECT 'Connection successful!';"
```

## الخطوة 4: إعداد PM2 لإدارة عمليات Node.js

```bash
# تثبيت PM2 عالميًا
npm install -g pm2
```

## الخطوة 5: إنشاء هيكل المجلدات وتحميل التطبيق

```bash
# إنشاء هيكل المجلدات
mkdir -p /home/ahjbu/web/ahjbu.com
mkdir -p /home/ahjbu/web/uploads/{images,videos,documents,files}
cd /home/ahjbu/web/ahjbu.com

# استنساخ المستودع من Git (قم بتغيير الرابط إلى مستودع التطبيق الخاص بك)
git clone <repository-url> .
# أو يمكنك رفع الملفات مباشرة باستخدام SCP أو SFTP
```

## الخطوة 6: تثبيت تبعيات التطبيق وبنائه

```bash
# تثبيت التبعيات
npm install

# بناء التطبيق للإنتاج
npm run build

# ضبط الصلاحيات
chmod -R 755 /home/ahjbu/web
```

## الخطوة 7: إعداد ملف البيئة (.env)

```bash
# إنشاء ملف .env
cat > /home/ahjbu/web/ahjbu.com/.env << 'EOL'
VITE_SUPABASE_URL=https://nmegscxlwywkuzrgyouh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZWdzY3hsd3l3a3V6cmd5b3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NDQ0ODUsImV4cCI6MjA2MjUyMDQ4NX0.6Ce1wG2tkZ_8XpeChmuUNPSM_bl3tMgzpXfMWQ_In5o

# إعدادات اتصال MySQL (للاستخدام من جانب الخادم فقط)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=ahjbu_ah_user
MYSQL_PASSWORD=BASem1462015%
MYSQL_DATABASE=ahjbu_ah_db
EOL
```

## الخطوة 8: إعداد خادم الملفات

```bash
# إنشاء مجلد الخادم
mkdir -p /home/ahjbu/web/server

# نسخ ملفات خادم الرفع
cp src/server/server.js /home/ahjbu/web/server/
cp -r src/server/* /home/ahjbu/web/server/

# تثبيت تبعيات الخادم
cd /home/ahjbu/web/server
npm init -y
npm install express cors multer mysql2 uuid
```

## الخطوة 9: إنشاء جداول قاعدة البيانات

```bash
# انتقل إلى المجلد الرئيسي للتطبيق
cd /home/ahjbu/web/ahjbu.com

# نسخ سكربتات الترحيل
mkdir -p /home/ahjbu/web/scripts
cp src/scripts/mysql-migration.js /home/ahjbu/web/scripts/
cp src/scripts/mysql-courses-migration.js /home/ahjbu/web/scripts/
cp src/scripts/deploy-mysql-setup.js /home/ahjbu/web/scripts/

# تثبيت وحدات MySQL للسكربتات
cd /home/ahjbu/web
npm install mysql2

# تنفيذ سكربت إعداد قاعدة البيانات
node scripts/deploy-mysql-setup.js
```

## الخطوة 10: إعداد PM2 لتشغيل التطبيق

```bash
# إنشاء ملف تكوين PM2
cd /home/ahjbu/web/ahjbu.com
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [
    {
      name: "ahjbu-frontend",
      script: "npm",
      args: "run preview",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    },
    {
      name: "ahjbu-file-server",
      script: "/home/ahjbu/web/server/server.js",
      env: {
        NODE_ENV: "production",
        PORT: "3001"
      }
    }
  ]
};
EOL

# تشغيل التطبيق مع PM2
pm2 start ecosystem.config.js

# إعداد PM2 للبدء مع تشغيل النظام
pm2 startup
pm2 save
```

## الخطوة 11: إعداد Nginx

```bash
# إنشاء تكوين Nginx للتطبيق
cat > /etc/nginx/sites-available/ahjbu.com << 'EOL'
server {
    listen 80;
    server_name ahjbu.com www.ahjbu.com;

    # تطبيق الواجهة
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # خادم API لرفع الملفات
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M; # السماح برفع ملفات حتى 50 ميجابايت
    }

    # خدمة الملفات المرفوعة مباشرة
    location /uploads/ {
        alias /home/ahjbu/web/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        try_files $uri $uri/ =404;
    }

    # تكوين للأصول الثابتة
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
    
    # رؤوس الأمان
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Frame-Options "SAMEORIGIN";
    
    # السجلات
    access_log /var/log/nginx/ahjbu.com-access.log;
    error_log /var/log/nginx/ahjbu.com-error.log;
}
EOL

# إنشاء رابط رمزي لتفعيل الموقع
ln -s /etc/nginx/sites-available/ahjbu.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# اختبار تكوين Nginx
nginx -t

# إعادة تشغيل Nginx
systemctl restart nginx
```

## الخطوة 12: إعداد SSL باستخدام Let's Encrypt

```bash
# تثبيت Certbot
apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
certbot --nginx -d ahjbu.com -d www.ahjbu.com
# اتبع التعليمات لإكمال إعداد شهادة SSL

# التحقق من تكوين Nginx
nginx -t

# إعادة تشغيل Nginx
systemctl restart nginx
```

## الخطوة 13: تكوين جدار الحماية

```bash
# تثبيت UFW إذا لم يكن موجودًا بالفعل
apt install -y ufw

# السماح بـ SSH و HTTP و HTTPS
ufw allow ssh
ufw allow http
ufw allow https

# تفعيل جدار الحماية
ufw enable
```

## الخطوة 14: إعداد النسخ الاحتياطي لقاعدة البيانات

```bash
# إنشاء مجلد النسخ الاحتياطي
mkdir -p /home/ahjbu/backups

# إنشاء سكربت النسخ الاحتياطي
cat > /home/ahjbu/backups/backup.sh << 'EOL'
#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/home/ahjbu/backups"
mysqldump -u ahjbu_ah_user -p'BASem1462015%' ahjbu_ah_db > "${BACKUP_DIR}/ahjbu_ah_db_${DATE}.sql"
find ${BACKUP_DIR} -name "ahjbu_ah_db_*.sql" -type f -mtime +7 -delete
EOL

# جعل سكربت النسخ الاحتياطي قابلاً للتنفيذ
chmod +x /home/ahjbu/backups/backup.sh

# إعداد النسخ الاحتياطي اليومي باستخدام crontab
(crontab -l 2>/dev/null; echo "0 1 * * * /home/ahjbu/backups/backup.sh") | crontab -
```

## الخطوة 15: إعداد سكربت التحديث التلقائي

```bash
# إنشاء سكربت لتحديث وإعادة تشغيل التطبيق تلقائيًا
cat > /home/ahjbu/update.sh << 'EOL'
#!/bin/bash

# الانتقال إلى مجلد التطبيق
cd /home/ahjbu/web/ahjbu.com

# سحب أحدث التغييرات
git pull

# تثبيت التبعيات
npm install

# بناء التطبيق
npm run build

# إعادة تشغيل التطبيق باستخدام PM2
pm2 restart all

# إعادة تشغيل Nginx
systemctl restart nginx

echo "تم تحديث التطبيق بنجاح في $(date)"
EOL

# جعل السكربت قابلاً للتنفيذ
chmod +x /home/ahjbu/update.sh
```

## الخطوات النهائية

1. إعادة تشغيل الخادم للتأكد من أن كل شيء يعمل بشكل صحيح:

```bash
reboot
```

2. بعد إعادة التشغيل، تحقق من حالة الخدمات:

```bash
# التحقق من حالة Nginx
systemctl status nginx

# التحقق من عمليات PM2
pm2 status

# التحقق من السجلات لأي أخطاء
pm2 logs
tail -f /var/log/nginx/error.log
```

3. زيارة الموقع على https://ahjbu.com للتأكد من أنه يعمل بشكل صحيح.

## استكشاف الأخطاء وإصلاحها

### مشاكل تشغيل التطبيق

تحقق من سجلات PM2:

```bash
pm2 logs ahjbu-frontend
```

### مشاكل Nginx

تحقق من سجلات أخطاء Nginx:

```bash
tail -f /var/log/nginx/error.log
```

### مشاكل اتصال MySQL

تحقق من تشغيل MySQL:

```bash
systemctl status mysql
```

اختبر الاتصال:

```bash
mysql -h localhost -u ahjbu_ah_user -p'BASem1462015%' -e "SELECT 1"
```

### مشاكل أذونات الملفات

إذا واجهت مشاكل في رفع الملفات، تحقق من أذونات المجلد:

```bash
sudo chown -R www-data:www-data /home/ahjbu/web/uploads
```

### مشاكل شهادة SSL

تحقق من سجلات Let's Encrypt:

```bash
tail -f /var/log/letsencrypt/letsencrypt.log
```

## مهام الصيانة

### تحديث التطبيق

```bash
cd /home/ahjbu/web/ahjbu.com
git pull
npm install
npm run build
pm2 restart all
```

أو استخدم السكربت التلقائي:

```bash
/home/ahjbu/update.sh
```

### تجديد شهادات SSL

يجب أن يجدد Certbot الشهادات تلقائيًا، ولكن يمكنك فرض التجديد بـ:

```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### مراقبة موارد الخادم

تثبيت واستخدام htop لمراقبة موارد الخادم:

```bash
sudo apt install -y htop
htop
```

## خاتمة

تهانينا! لقد قمت الآن بإعداد التطبيق بنجاح على خادم VPS مع تكامل MySQL. يمكنك الوصول إلى التطبيق على https://ahjbu.com.

إذا واجهت أي مشاكل أو كانت لديك أسئلة، يمكنك الرجوع إلى هذا الدليل أو التواصل مع مدير النظام للحصول على المساعدة.
