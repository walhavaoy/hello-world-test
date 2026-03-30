ARG BASE_IMAGE=node:18-alpine

# Stage 1 — Build
FROM ${BASE_IMAGE} AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2 — Production
FROM ${BASE_IMAGE}
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=build /app/dist/ ./dist/
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
