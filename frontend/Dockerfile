FROM node:22-alpine AS builder
WORKDIR /app

# Copie les fichiers du repo vers le container
COPY . .

#Installe pnpm et les dependances
RUN npm install -g pnpm
RUN pnpm install

# Fait les tests (si echouent, ne va pas plus loin)
RUN pnpm run test

# Fait le build de prod
RUN pnpm run build

# On sert les fichiers avec un serveur http (Caddy)
FROM caddy:2-alpine
EXPOSE 80
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist/mpmt-frontend/browser /usr/share/caddy
