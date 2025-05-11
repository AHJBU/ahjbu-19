
# VPS Deployment Guide for AHJBU.com

This guide outlines the steps to deploy the AHJBU.com website on a VPS server using Nginx and MySQL.

## Prerequisites

- VPS server with SSH access (IP: 84.46.240.246)
- Root or sudo privileges
- MySQL database server installed
- Node.js (v16+) and npm installed

## Step 1: Connect to Your VPS

```bash
ssh root@84.46.240.246
```

## Step 2: Install Required Software

```bash
# Update package list
apt update
apt upgrade -y

# Install required software
apt install -y nginx nodejs npm mysql-server

# Install PM2 for Node.js process management
npm install -g pm2
```

## Step 3: Configure MySQL

```bash
# Secure MySQL installation
mysql_secure_installation

# Access MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE ahjbu_ah_db;
CREATE USER 'ahjbu_ah_user'@'localhost' IDENTIFIED BY 'BASem1462015%';
GRANT ALL PRIVILEGES ON ahjbu_ah_db.* TO 'ahjbu_ah_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 4: Deploy Frontend Application

```bash
# Navigate to web directory
mkdir -p /home/ahjbu/web/ahjbu.com
cd /home/ahjbu/web/ahjbu.com

# Clone or upload your application files
# Option 1: Clone from Git repository
# git clone <repository-url> .

# Option 2: Upload using SCP (run this on your local machine)
# scp -r ./dist/* root@84.46.240.246:/home/ahjbu/web/ahjbu.com/

# Set appropriate permissions
chown -R www-data:www-data /home/ahjbu/web/ahjbu.com
chmod -R 755 /home/ahjbu/web/ahjbu.com
```

## Step 5: Set up MySQL Database Schema

```bash
# Copy migration scripts
mkdir -p /home/ahjbu/web/scripts
cp src/scripts/mysql-migration.js /home/ahjbu/web/scripts/
cp src/scripts/mysql-courses-migration.js /home/ahjbu/web/scripts/
cp src/scripts/deploy-mysql-setup.js /home/ahjbu/web/scripts/

# Install dependencies
cd /home/ahjbu/web
npm init -y
npm install mysql2

# Run database setup script
node scripts/deploy-mysql-setup.js
```

## Step 6: Set up File Upload Server

```bash
# Create server directory
mkdir -p /home/ahjbu/web/server
cp src/server/server.js /home/ahjbu/web/server/

# Install server dependencies
cd /home/ahjbu/web/server
npm init -y
npm install express cors multer mysql2 uuid

# Create uploads directory
mkdir -p /home/ahjbu/web/uploads/{images,videos,documents,files}
chmod -R 755 /home/ahjbu/web/uploads

# Start the server with PM2
pm2 start server.js --name ahjbu-file-server
pm2 save
pm2 startup
```

## Step 7: Configure Nginx

```bash
# Create Nginx configuration file
cat > /etc/nginx/sites-available/ahjbu.com << 'EOL'
server {
    listen 80;
    server_name ahjbu.com www.ahjbu.com;
    root /home/ahjbu/web/ahjbu.com;
    index index.html;

    # API and file upload server
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files
    location /uploads {
        alias /home/ahjbu/web/uploads;
    }

    # SPA configuration
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Frame-Options "SAMEORIGIN";

    # Logging
    access_log /var/log/nginx/ahjbu.com-access.log;
    error_log /var/log/nginx/ahjbu.com-error.log;
}
EOL

# Enable the site
ln -s /etc/nginx/sites-available/ahjbu.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

## Step 8: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d ahjbu.com -d www.ahjbu.com

# Certbot will modify the Nginx configuration automatically
# Verify Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

## Step 9: Configure Firewall

```bash
# Install UFW if not already installed
apt install -y ufw

# Allow SSH, HTTP, and HTTPS
ufw allow ssh
ufw allow http
ufw allow https

# Enable firewall
ufw enable
```

## Step 10: Set Up Automatic Updates

```bash
# Install unattended-upgrades
apt install -y unattended-upgrades

# Configure automatic updates
dpkg-reconfigure -plow unattended-upgrades
```

## Step 11: Set Up Database Backup

```bash
# Create backup directory
mkdir -p /home/ahjbu/backups

# Create backup script
cat > /home/ahjbu/backups/backup.sh << 'EOL'
#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/home/ahjbu/backups"
mysqldump -u ahjbu_ah_user -p'BASem1462015%' ahjbu_ah_db > "${BACKUP_DIR}/ahjbu_ah_db_${DATE}.sql"
find ${BACKUP_DIR} -name "ahjbu_ah_db_*.sql" -type f -mtime +7 -delete
EOL

# Make backup script executable
chmod +x /home/ahjbu/backups/backup.sh

# Set up daily backup using crontab
(crontab -l 2>/dev/null; echo "0 1 * * * /home/ahjbu/backups/backup.sh") | crontab -
```

## Additional Notes

- **Troubleshooting**: Check Nginx logs at `/var/log/nginx/ahjbu.com-error.log` if you encounter issues.
- **Database Management**: You can use tools like phpMyAdmin for easier database management.
- **Regular Maintenance**: Regularly update your server with `apt update && apt upgrade -y`.
- **Monitoring**: Set up monitoring tools to keep track of server health.

## Final Steps

1. Update the `.env` file in your application to point to the correct database credentials.
2. Ensure all API endpoints are configured to use the correct base URL.
3. Test the website thoroughly to ensure all features work as expected.

## Contact for Support

For any issues or questions regarding deployment, please contact your system administrator.
