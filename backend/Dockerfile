FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

ENV NODE_ENV=production
ENV PORT=2001

EXPOSE 2001

CMD ["node", "src/server.js"]


