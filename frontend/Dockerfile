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

# Serve static build tanpa pembatasan allowedHosts
RUN npm i -g serve
COPY --from=build /app/dist ./dist

ENV PORT=2002
EXPOSE 2002

CMD ["serve", "-s", "dist", "-l", "2002"]


