FROM node:22-alpine AS development-dependencies-env
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS build-env
RUN corepack enable pnpm
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
# VITE_* vars are inlined at build time, so they must be available inside the
# Docker build. Railway passes service variables as build args for declared ARGs.
ARG VITE_GA
ARG VITE_MAINNET_RPC
ENV VITE_GA=$VITE_GA
ENV VITE_MAINNET_RPC=$VITE_MAINNET_RPC
RUN pnpm run build

FROM node:22-alpine AS production-dependencies-env
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install --frozen-lockfile --prod

FROM node:22-alpine
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml server.ts /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["pnpm", "run", "start"]