# Public Docker images repo has a pull limit
ARG REGISTRY_BASE=node
# Build Stage 1
# This build created a staging docker image
#
FROM ${REGISTRY_BASE}:16-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY .env* ./
RUN npm ci
COPY . .
RUN npm run build
# Prune packages and reuse them in next stage
RUN npm prune --production

# Build Stage 2
# This build takes the production build from staging build
#
FROM ${REGISTRY_BASE}:16-alpine AS prod
ARG APP_VERSION
WORKDIR /home/site/wwwroot
COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env* ./
ENV APP_VERSION=${APP_VERSION}

FROM ${REGISTRY_BASE}:16-alpine AS dev
WORKDIR /usr/src/app
COPY package*.json ./
COPY .env* ./
RUN npm install
COPY . .
EXPOSE 4001
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

