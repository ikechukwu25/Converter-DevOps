# Nginx Configuration for Converter Application

## Install Nginx
SSH into the VM and run:

`sudo apt update`
`sudo apt install nginx -y`

## Configure Nginx as Reverse Proxy



Create a new Nginx configuration file for your application: 
`sudo vi /etc/nginx/sites-available/converter-app`

Add the following configuration:

`server {`
`    listen 80;`

`    location / {`
`        proxy_pass http://localhost:5000;`
`        proxy_set_header Host $host;`
`        proxy_set_header X-Real-IP $remote_addr;`
`        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`
`        proxy_set_header X-Forwarded-Proto $scheme;`
`    }`
`}`

Enable the configuration by creating a symbolic link: 
`sudo ln -s /etc/nginx/sites-available/converter-app /etc/nginx/sites-enabled/`

Test the Nginx configuration: 
`sudo nginx -t`

Reload Nginx to apply the changes: 
`sudo systemctl reload nginx`

