FROM node:16-alpine

ARG SCRIPT_PATH="./"
ENV SCRIPT_PATH ${SCRIPT_PATH}

# Install git and pnpm
RUN apk add --no-cache git libc6-compat
RUN npm install -g pnpm

WORKDIR /workdir

COPY . .
WORKDIR /workdir/scripts/sushi

RUN pnpm install
RUN pnpm generate
RUN pnpm prisma generate

CMD pnpm ts-node "./$SCRIPT_PATH"