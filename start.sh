#!/bin/sh
/usr/local/bin/tailscaled --tun=userspace-networking --socks5-server=localhost:1055 &
/usr/local/bin/tailscale up --authkey="${TAILSCALE_AUTHKEY}" --hostname=fms-frontend-app
nginx -g 'daemon off;'
