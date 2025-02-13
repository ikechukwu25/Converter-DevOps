# Nginx Configuration for Converter Application

## Install Nginx
SSH into the VM and run:

`sudo apt update` </br>
`sudo apt install nginx -y`

## Configure Nginx as Reverse Proxy

**What Does Configuring Nginx as a Reverse Proxy Do?**
When you configure Nginx as a reverse proxy, you are setting it up to act as an intermediary between clients (users' browsers) and your application running on the server. Instead of users directly accessing the application, they send requests to Nginx, and Nginx forwards those requests to your app.

**Why Use a Reverse Proxy?**
- Hides Internal Server Details – Users interact only with Nginx, which protects your backend.
- Improves Security – Blocks direct access to your app, preventing exposure to attacks.
- Load Balancing (Optional) – If you have multiple app instances, Nginx can distribute traffic.
- Handles SSL/TLS – Terminates HTTPS traffic before forwarding it to the backend.
- Caching & Compression – Can improve performance by caching responses and compressing data.

**What Happens When a User Visits Your Site?**
- User Requests:
    A user types http://your-vm-ip/ in their browser.
- Nginx Handles the Request:
    Since it listens on port 80, it receives the request.
- Nginx Forwards to App:
    It redirects the request to http://localhost:5000 (your app running inside the VM).
- App Responds to Nginx:
    Your app generates a response (e.g., an HTML page or JSON data).
- Nginx Sends Response to User:
    The user receives the app's response, but they never see port 5000—only Nginx.


## Steps to Configure Nginx as Reverse Proxy

- Create a new Nginx configuration file for your application: </br>
    `sudo vi /etc/nginx/sites-available/converter-app`

- Add the following configuration: </br>

    `server {` </br>
    `    listen 80;` </br>
    `    location / {` </br>
    `        proxy_pass http://localhost:5000;` </br>
    `        proxy_set_header Host $host;` </br>
    `        proxy_set_header X-Real-IP $remote_addr;` </br>
    `        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` </br>
    `        proxy_set_header X-Forwarded-Proto $scheme;` </br>
    `    }` </br>
    `}`

- Enable the configuration by creating a symbolic link:  </br>
    `sudo ln -s /etc/nginx/sites-available/converter-app /etc/nginx/sites-enabled/`

- Test the Nginx configuration: </br>
    `sudo nginx -t`

- Reload Nginx to apply the changes:  </br>
    `sudo systemctl reload nginx`


## Troubleshooting Nginx as Reverse Proxy

If your VM's public IP is still showing the default Nginx welcome page instead of your application, here are some things to check and fix:

- Ensure Nginx is Using the Correct Configuration: </br>
    Run the following command to check the active configuration: </br>
    `sudo nginx -t` </br>
    If you see any errors, fix them before proceeding.

- Then, make sure your custom configuration is enabled: </br>
    `ls -l /etc/nginx/sites-enabled/` </br>
    The expected output should show a symbolic link to converter-app: </br>
    `lrwxrwxrwx 1 root root 34 Feb 12 12:00 /etc/nginx/sites-enabled/converter-app -> /etc/nginx/sites-available/converter-app` </br>
    If it's missing, manually create the symlink: </br>
    `sudo ln -s /etc/nginx/sites-available/converter-app /etc/nginx/sites-enabled/` </br>
    `sudo systemctl restart nginx`

- Remove the Default Nginx Page </br>
    The default Nginx page appears if Nginx is still loading the default config. </br>
    Disable it by removing the symlink: </br>
    `sudo rm /etc/nginx/sites-enabled/default` </br>
    `sudo systemctl restart nginx`

- Confirm Your Application is Running on Port 5000 </br>
    Your proxy_pass is forwarding requests to `http://localhost:5000`. </br>
    Check if your app is actually running on that port: </br>
    `sudo netstat -tulnp | grep 5000` </br>
    `sudo ss -tulnp | grep 5000` </br>
    If you don't see output:
      - Your app isn’t running, or
      - It's listening on a different port.


Now, test if your IP loads your app.







