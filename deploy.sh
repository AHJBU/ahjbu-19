
#!/bin/bash

# Navigate to the website directory
cd /home/ahjbu/web/ahjbu.com/public_html

# Update Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/ahjbu.com

# Test Nginx configuration
sudo nginx -t

# If configuration test is successful, reload Nginx
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "Nginx configuration updated and reloaded successfully."
else
    echo "Error in Nginx configuration. Please check the syntax."
    exit 1
fi

# Clear any cache
sudo systemctl restart nginx

echo "Deployment completed successfully."
echo "Your website should now handle all routes correctly."
