#!/bin/sh

# Start Tailscaled in the background
/app/tailscaled --tun=userspace-networking --socks5-server=localhost:3000 &

# Bring up Tailscale interface
/app/tailscale up --authkey=tskey-auth-kK1XFqcBBS11CNTRL-FYG32cRGdASs56UfHKRgASD4AQrNdiGd --hostname=fms-frontend

echo "Tailscale started"

# nginx runs in the foreground. Change this to your process if not using Nginx
# Important: Must not run your main application process as root user. If your application needs root privileges, adjust the Dockerfile to run it as root, and create another non-root user specifically for starting the Tailscale process
nginx -g "daemon off;"
