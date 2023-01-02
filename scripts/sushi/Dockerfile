FROM node:16-alpine

ARG SCRIPT_PATH="./"
ENV SCRIPT_PATH ${SCRIPT_PATH}

# Install git and pnpm
RUN apk add --no-cache git libc6-compat
RUN npm install -g pnpm@7.18.2

WORKDIR /workdir
COPY . .
RUN pnpm install
RUN pnpm exec turbo run build --filter=sushi

WORKDIR /workdir/scripts/sushi

RUN pnpm prisma generate

CMD pnpm ts-node --swc --esm "./$SCRIPT_PATH"