FROM node:16-alpine
# Line below needed for prisma generate, https://github.com/prisma/prisma/issues/14073#issuecomment-1348534199
RUN apk add --update openssl1.1-compat 

ARG SCRIPT_PATH="./"
ENV SCRIPT_PATH ${SCRIPT_PATH}

# Install git and pnpm
RUN apk add --no-cache git libc6-compat
RUN npm install -g pnpm

WORKDIR /workdir
COPY . .
RUN pnpm exec turbo run build --filter=chain

WORKDIR /workdir/scripts/sushi

RUN pnpm install
RUN pnpm generate
RUN pnpm prisma generate

CMD pnpm ts-node --swc --esm "./$SCRIPT_PATH"