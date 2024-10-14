FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS final
# If you need additional packages, install them here
RUN apk add --no-cache curl # Example: Adding curl

WORKDIR /app

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Tailscale binaries
COPY --from=docker.io/tailscale/tailscale:stable /usr/local/bin/tailscaled /app/tailscaled
COPY --from=docker.io/tailscale/tailscale:stable /usr/local/bin/tailscale /app/tailscale

# Create necessary directories
RUN mkdir -p /var/run/tailscale /var/cache/tailscale /var/lib/tailscale

# Expose port 80 (for Nginx)
EXPOSE 80

# Use the correct user for Tailscale related processes
USER tailscale

CMD ["/bin/sh", "-c", "tailscaled --tun=userspace-networking & tailscale up --authkey=${TAILSCALE_AUTH_KEY} --hostname=cloudrun-app && nginx -g 'daemon off;'"]
