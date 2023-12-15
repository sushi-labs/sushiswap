FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY . .

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