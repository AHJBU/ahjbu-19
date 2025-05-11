
# VPS Deployment Guide with MySQL Integration

This guide provides step-by-step instructions for deploying the portfolio application on your VPS server with MySQL integration.

## Prerequisites

- VPS server running Ubuntu 20.04 or higher
- Root access or a user with sudo privileges
- MySQL database server
- Domain name (ahjbu.com) pointing to your server

## Step 1: Server Preparation

Connect to your VPS using SSH:

```bash
ssh root@84.46.240.246
```

Update your server packages:

```bash
sudo apt update
sudo apt upgrade -y
```

Install essential tools:

```bash
sudo apt install -y curl git build-essential nginx
```

## Step 2: Install Node.js

Install Node.js using Node Version Manager (NVM):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

Verify the installation:

```bash
node -v
npm -v
```

## Step 3: Install MySQL Client

Make sure MySQL client is installed:

```bash
sudo apt install -y mysql-client
```

Connect to your MySQL database to verify credentials:

```bash
mysql -h localhost -P 3306 -u ahjbu_ah_user -p
# Enter password when prompted: BASem1462015%
```

Once connected, make sure the database exists:

```sql
SHOW DATABASES;
USE ahjbu_ah_db;
```

## Step 4: Install PM2

PM2 is a process manager for Node.js applications:

```bash
npm install -g pm2
```

## Step 5: Clone the Repository

Create a directory for your application and clone the repository:

```bash
mkdir -p /home/ahjbu/web
cd /home/ahjbu/web
git clone <your-repository-url> ahjbu.com
cd ahjbu.com
```

## Step 6: Install Dependencies and Build the Application

Install dependencies and build the application:

```bash
npm install
npm run build
```

## Step 7: Set Up MySQL Tables

Run the MySQL migration script to create necessary tables:

```bash
node src/scripts/mysql-migration.js
```

## Step 8: Configure Environment Variables

Create a `.env` file in the root directory of your application:

```bash
touch .env
nano .env
```

Add your Supabase and other configuration values:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# MySQL connection (for server-side only)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=ahjbu_ah_user
MYSQL_PASSWORD=BASem1462015%
MYSQL_DATABASE=ahjbu_ah_db
```

## Step 9: Configure PM2

Create a PM2 ecosystem configuration file:

```bash
touch ecosystem.config.js
nano ecosystem.config.js
```

Add the following configuration:

```javascript
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
      script: "server/file-upload.js",
      env: {
        NODE_ENV: "production",
        PORT: "3001"
      }
    }
  ]
};
```

Start the application with PM2:

```bash
pm2 start ecosystem.config.js
```

Set up PM2 to start on system boot:

```bash
pm2 startup
pm2 save
```

## Step 10: Configure Nginx

Create an Nginx configuration for your application:

```bash
sudo nano /etc/nginx/sites-available/ahjbu.com
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name ahjbu.com www.ahjbu.com;

    # Frontend application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # File upload server API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M; # Allow file uploads up to 50MB
    }

    # Serve uploaded files directly
    location /uploads/ {
        alias /home/ahjbu/web/ahjbu.com/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        try_files $uri $uri/ =404;
    }
}
```

Create a symbolic link to enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/ahjbu.com /etc/nginx/sites-enabled/
```

Remove the default site if needed:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

Test the Nginx configuration and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Step 11: Set Up SSL with Let's Encrypt

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Obtain an SSL certificate:

```bash
sudo certbot --nginx -d ahjbu.com -d www.ahjbu.com
```

Follow the prompts to complete the SSL certificate setup.

## Step 12: Create Uploads Directory

Create and set permissions for the uploads directory:

```bash
mkdir -p /home/ahjbu/web/ahjbu.com/uploads/{images,videos,files}
chmod -R 755 /home/ahjbu/web/ahjbu.com/uploads
```

## Step 13: Set Up Automatic Updates

Create a script to automatically update and restart the application:

```bash
nano /home/ahjbu/update.sh
```

Add the following content:

```bash
#!/bin/bash

# Navigate to the application directory
cd /home/ahjbu/web/ahjbu.com

# Pull the latest changes
git pull

# Install dependencies
npm install

# Build the application
npm run build

# Restart the application with PM2
pm2 restart all

# Restart Nginx
sudo systemctl restart nginx
```

Make the script executable:

```bash
chmod +x /home/ahjbu/update.sh
```

## Step 14: Set Up Cron Job for Database Backups

Create a script to backup your MySQL database:

```bash
nano /home/ahjbu/backup_db.sh
```

Add the following content:

```bash
#!/bin/bash

# Define backup directory
BACKUP_DIR="/home/ahjbu/backups"
mkdir -p $BACKUP_DIR

# Create a backup with timestamp
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
mysqldump -h localhost -u ahjbu_ah_user -p'BASem1462015%' ahjbu_ah_db > $BACKUP_DIR/ahjbu_db_$TIMESTAMP.sql

# Compress the backup
gzip $BACKUP_DIR/ahjbu_db_$TIMESTAMP.sql

# Keep only the last 7 backups
ls -tp $BACKUP_DIR/ahjbu_db_*.sql.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {}
```

Make the script executable:

```bash
chmod +x /home/ahjbu/backup_db.sh
```

Set up a cron job to run the backup daily:

```bash
crontab -e
```

Add the following line:

```
0 3 * * * /home/ahjbu/backup_db.sh
```

This will run the backup every day at 3 AM.

## Step 15: Set Up Monitoring

Install and configure a basic monitoring tool like UptimeRobot to monitor your website's health.

## Final Steps

1. Restart your VPS server:

```bash
sudo reboot
```

2. After restart, verify that everything is working:

```bash
# Check nginx status
sudo systemctl status nginx

# Check PM2 processes
pm2 status

# Check the logs for any errors
pm2 logs
```

3. Visit your website at https://ahjbu.com to make sure everything is working correctly.

## Troubleshooting

### Application not starting

Check the PM2 logs:

```bash
pm2 logs ahjbu-frontend
```

### Nginx not working

Check the Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

### MySQL connection issues

Check if MySQL is running:

```bash
sudo systemctl status mysql
```

Test the connection:

```bash
mysql -h localhost -u ahjbu_ah_user -p'BASem1462015%' -e "SELECT 1"
```

### File permission issues

If you have issues with file uploads, check the directory permissions:

```bash
sudo chown -R www-data:www-data /home/ahjbu/web/ahjbu.com/uploads
```

### SSL certificate issues

Check the Let's Encrypt logs:

```bash
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

## Maintenance Tasks

### Updating the application

```bash
cd /home/ahjbu/web/ahjbu.com
git pull
npm install
npm run build
pm2 restart all
```

### Renewing SSL certificates

Certbot should automatically renew certificates, but you can force a renewal with:

```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

### Monitoring server resources

Install and use htop to monitor server resources:

```bash
sudo apt install -y htop
htop
```
