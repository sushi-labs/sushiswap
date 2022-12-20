FROM node:16-alpine

ARG SCRIPT_PATH="./"
ENV SCRIPT_PATH ${SCRIPT_PATH}

RUN npm install -g pnpm

WORKDIR /workdir

COPY . .
RUN echo "$PWD"

WORKDIR /workdir/scripts/sushi
RUN pnpm install
RUN echo "$PWD"
RUN pnpm generate
RUN pnpm prisma generate

CMD pnpm ts-node "./$SCRIPT_PATH"