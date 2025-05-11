
# Deployment Guide

This document outlines the steps to deploy your web application to a VPS (Virtual Private Server).

## 1. Prerequisites

- A VPS with at least 1GB RAM (recommended: 2GB+ for better performance)
- Ubuntu 20.04 LTS or higher
- SSH access to your VPS
- A domain name (optional, but recommended)
- Basic knowledge of Linux commands

## 2. Initial Server Setup

### 2.1 Update Your Server

```bash
sudo apt update
sudo apt upgrade -y
```

### 2.2 Set Up a Firewall

```bash
sudo apt install ufw
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 2.3 Create a Non-Root User (Optional but Recommended)

```bash
sudo adduser appuser
sudo usermod -aG sudo appuser
```

## 3. Install Required Software

### 3.1 Install Node.js and npm

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify the installation:

```bash
node --version
npm --version
```

### 3.2 Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3.3 Install Git

```bash
sudo apt install git -y
```

### 3.4 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

## 4. Clone and Build Your Application

### 4.1 Clone Your Repository

```bash
mkdir -p /var/www
cd /var/www
git clone YOUR_REPOSITORY_URL app
cd app
```

### 4.2 Install Dependencies and Build

```bash
npm install
npm run build
```

## 5. Configure Nginx

### 5.1 Create a New Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/myapp
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Additional configuration for API if needed
    # location /api/ {
    #     proxy_pass http://localhost:3001;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection 'upgrade';
    #     proxy_set_header Host $host;
    #     proxy_cache_bypass $http_upgrade;
    # }
}
```

### 5.2 Enable the Configuration

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 6. Setup SSL with Let's Encrypt (Recommended)

### 6.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Obtain and Install SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts to complete the setup.

## 7. Setup Environment Variables

Create a `.env` file in your project root:

```bash
nano /var/www/app/.env
```

Add your environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
# Add other environment variables as needed
```

## 8. Set Up Continuous Deployment (Optional)

### 8.1 Create a Deployment Script

```bash
nano /var/www/app/deploy.sh
```

Add the following content:

```bash
#!/bin/bash
cd /var/www/app
git pull
npm install
npm run build
pm2 restart myapp
```

Make the script executable:

```bash
chmod +x /var/www/app/deploy.sh
```

### 8.2 Set Up a Webhook or CI/CD Pipeline

Configure your repository to call this script when you push to the main branch.

## 9. Start Your Application with PM2

If your application has a server component (Node.js API), set it up with PM2:

```bash
cd /var/www/app
pm2 start server/index.js --name myapp
pm2 save
pm2 startup
```

## 10. Monitoring and Maintenance

### 10.1 Monitor Your Application

```bash
pm2 status
pm2 logs myapp
```

### 10.2 Set Up Regular Updates

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## 11. Backup Strategy

### 11.1 Database Backups

Supabase provides automatic backups, but you can also set up additional backups:

```bash
# Example: Create a backup script for Supabase
nano /var/www/backup-db.sh
```

Add:

```bash
#!/bin/bash
DATE=$(date +"%Y-%m-%d")
curl -X POST "https://your-project-ref.supabase.co/rest/v1/rpc/pg_dump" \
  -H "apikey: your-service-role-key" \
  -H "Authorization: Bearer your-service-role-key" \
  -H "Content-Type: application/json" \
  --output "/var/backups/db-$DATE.sql"
```

Make the script executable and set up a cron job:

```bash
chmod +x /var/www/backup-db.sh
crontab -e
```

Add:

```cron
0 2 * * * /var/www/backup-db.sh
```

### 11.2 File Backups

Set up regular file backups:

```bash
sudo apt install rsync
```

Create a backup script:

```bash
nano /var/www/backup-files.sh
```

Add:

```bash
#!/bin/bash
DATE=$(date +"%Y-%m-%d")
rsync -avz --delete /var/www/app/ /var/backups/app-$DATE/
```

Set up a cron job as needed.

## 12. Troubleshooting

### 12.1 Check Nginx Logs

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 12.2 Check Application Logs

```bash
pm2 logs myapp
```

### 12.3 Check System Resources

```bash
htop
```

### 12.4 Test Nginx Configuration

```bash
sudo nginx -t
```

## 13. Additional Considerations

- Set up a CDN like Cloudflare for better performance
- Implement rate limiting in Nginx to prevent abuse
- Set up monitoring with tools like Uptime Robot or Grafana
- Implement regular security audits

## 14. Security Best Practices

- Keep your server updated
- Use strong passwords
- Disable password authentication in SSH and use key-based authentication
- Implement fail2ban to prevent brute force attacks
- Regularly check for security vulnerabilities

By following this guide, you should have a fully functional and secure deployment of your web application on a VPS.
