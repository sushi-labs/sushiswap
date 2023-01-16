FROM node:16-alpine

# Install git and pnpm
RUN apk add --no-cache git libc6-compat
RUN npm install -g pnpm@7.18.2

WORKDIR /workdir
COPY . .
RUN pnpm install
RUN pnpm exec turbo run build --filter=farms-script

WORKDIR /workdir/scripts/farms

CMD pnpm ts-node --swc --esm ./src/run.ts