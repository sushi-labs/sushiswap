FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
 
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN corepack enable

WORKDIR /app

# RUN pnpm install turbo --global

COPY apis/extractor apis/extractor
COPY packages packages
COPY config config
COPY patches patches

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY pnpm-workspace.yaml pnpm-workspace.yaml
COPY turbo.json turbo.json

# RUN turbo prune @sushiswap/extractor-api --docker

FROM base AS installer

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm exec turbo run build --filter=extractor-api

FROM base AS runner

COPY --from=installer /app/node_modules /app/node_modules
COPY --from=builder /app/apis/extractor/dist /app/apis/extractor/dist

EXPOSE 80

CMD node /app/apis/extractor/dist/index.js