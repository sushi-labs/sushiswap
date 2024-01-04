FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
 
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN corepack enable

WORKDIR /app

# RUN pnpm install turbo --global

COPY apis/extractor apis/extractor

COPY config/router config/router
COPY config/jest config/jest
COPY config/typescript config/typescript
COPY config/viem config/viem

COPY packages/extractor packages/extractor
COPY packages/router packages/router
COPY packages/sushi packages/sushi
COPY packages/tines packages/tines
COPY packages/trident-sdk packages/trident-sdk
COPY packages/v2-sdk packages/v2-sdk
COPY packages/v3-sdk packages/v3-sdk

COPY patches patches

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY turbo.json turbo.json

# RUN turbo prune @sushiswap/extractor-api --docker

FROM base AS installer

RUN pnpm install --prod --frozen-lockfile
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


FROM base AS builder

RUN pnpm install --frozen-lockfile
RUN pnpm exec turbo run build --filter=extractor-api

FROM base AS runner

COPY --from=installer /app/node_modules /app/node_modules
COPY --from=installer /app/apis/extractor/node_modules /app/apis/extractor/node_modules
COPY --from=builder /app/apis/extractor/dist /app/apis/extractor/dist

EXPOSE 80

CMD node /app/apis/extractor/dist/index.js