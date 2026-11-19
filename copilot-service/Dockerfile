FROM node:22-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY index.js server.js ./
ENV NODE_ENV=production
EXPOSE 8788
CMD ["npm", "start"]
