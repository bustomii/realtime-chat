ARG BASE_IMAGE=node:20-alpine
FROM ${BASE_IMAGE}

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

COPY src ./src

ENV NODE_ENV=production
ENV PORT=2001

EXPOSE 2001

CMD ["node", "src/server.js"]


