FROM node:22-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && test -s /etc/ssl/certs/ca-certificates.crt

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY index.js server.js ./
ENV NODE_ENV=production
EXPOSE 8788
CMD ["npm", "start"]
