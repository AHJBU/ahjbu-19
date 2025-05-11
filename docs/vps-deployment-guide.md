
# VPS Deployment Guide

This guide provides step-by-step instructions for deploying the portfolio application on a Virtual Private Server (VPS) using Nginx and PM2.

## Prerequisites

- A VPS server running Ubuntu 20.04 or higher
- Root access or a user with sudo privileges
- A domain name pointing to your server (optional but recommended)

## Step 1: Server Setup

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

## Step 3: Install PM2

PM2 is a process manager for Node.js applications:

```bash
npm install -g pm2
```

## Step 4: Clone the Repository

Create a directory for your application and clone the repository:

```bash
mkdir -p /var/www
cd /var/www
git clone <your-repository-url> portfolio-app
cd portfolio-app
```

## Step 5: Install Dependencies and Build the Application

Install the dependencies and build the application:

```bash
npm install
npm run build
```

## Step 6: Configure Environment Variables

Create a `.env` file in the root directory of your application:

```bash
touch .env
nano .env
```

Add your Supabase and Firebase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## Step 7: Configure PM2

Create a PM2 ecosystem configuration file:

```bash
touch ecosystem.config.js
nano ecosystem.config.js
```

Add the following configuration:

```javascript
module.exports = {
  apps: [{
    name: "portfolio-app",
    script: "npm",
    args: "run preview",
    env: {
      NODE_ENV: "production",
      PORT: "3000"
    }
  }]
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

## Step 8: Configure Nginx

Create an Nginx configuration for your application:

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Add the following configuration (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Create a symbolic link to enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
```

Test the Nginx configuration and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Step 9: Set Up SSL with Let's Encrypt

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Obtain an SSL certificate:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts to complete the SSL certificate setup.

## Step 10: Set Up Automatic Deployment (Optional)

For automatic deployment, you can set up a webhook or use tools like GitHub Actions.

Basic webhook setup:

1. Install webhook on your server:

```bash
sudo apt install -y webhook
```

2. Create a webhook configuration file:

```bash
sudo nano /etc/webhook.conf
```

3. Add the following configuration:

```json
[
  {
    "id": "deploy-portfolio",
    "execute-command": "/var/www/deploy-script.sh",
    "command-working-directory": "/var/www/portfolio-app",
    "response-message": "Deployment started",
    "trigger-rule": {
      "match": {
        "type": "value",
        "value": "your-secret-token",
        "parameter": {
          "source": "payload",
          "name": "token"
        }
      }
    }
  }
]
```

4. Create a deployment script:

```bash
sudo nano /var/www/deploy-script.sh
```

5. Add the following content:

```bash
#!/bin/bash

cd /var/www/portfolio-app
git pull
npm install
npm run build
pm2 restart portfolio-app
```

6. Make the script executable:

```bash
sudo chmod +x /var/www/deploy-script.sh
```

7. Start the webhook server:

```bash
webhook -hooks /etc/webhook.conf -verbose
```

## Step 11: Set Up Regular Backups

Install and configure Restic or other backup tools for regular backups of your data.

## Step 12: Set Up Monitoring

Configure monitoring using tools like UptimeRobot, NewRelic, or Prometheus with Grafana to monitor your application's health.

## Troubleshooting

### Application not starting

Check the PM2 logs:

```bash
pm2 logs portfolio-app
```

### Nginx not working

Check the Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate issues

Check the Let's Encrypt logs:

```bash
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

## Maintenance Tasks

### Updating the application

```bash
cd /var/www/portfolio-app
git pull
npm install
npm run build
pm2 restart portfolio-app
```

### Renewing SSL certificates

Certbot should automatically renew certificates, but you can force a renewal with:

```bash
sudo certbot renew --force-renewal
```

### Monitoring server resources

Install and use htop to monitor server resources:

```bash
sudo apt install -y htop
htop
```
