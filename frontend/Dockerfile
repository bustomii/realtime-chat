ARG BASE_IMAGE=node:20-alpine
FROM ${BASE_IMAGE} AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_WS_URL=http://localhost:2001
ENV VITE_WS_URL=${VITE_WS_URL}
RUN npm run build

FROM ${BASE_IMAGE} AS runner
WORKDIR /app

# Serve menggunakan vite preview agar mudah
RUN npm i vite@latest -g
COPY --from=build /app/dist ./dist

ENV PORT=2002
EXPOSE 2002

CMD ["vite", "preview", "--strictPort", "--host", "0.0.0.0", "--port", "2002", "--open", "false"]


