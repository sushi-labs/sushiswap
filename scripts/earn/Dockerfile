# NOTE: this Dockerfile is placed in the package, but it needs to run from the root of the monorepo
FROM node:16-alpine

ARG SCRIPT_PATH="./"
ENV SCRIPT_PATH ${SCRIPT_PATH}

# Install git and pnpm
RUN apk add --no-cache git libc6-compat
RUN npm install -g pnpm

WORKDIR /workdir
COPY . .

RUN HUSKY=0 pnpm install
RUN pnpm exec turbo run build --filter=earn-script

# Delete store path since it's now unneeded
RUN rm -rf $(pnpm store path)

WORKDIR /workdir/scripts/earn
RUN pnpm prisma generate

EXPOSE 8080/tcp
CMD pnpm ts-node --swc --esm "./$SCRIPT_PATH"