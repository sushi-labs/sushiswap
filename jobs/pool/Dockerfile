FROM node:20-alpine

# Install git and pnpm
RUN apk add --no-cache git libc6-compat grep python3 make g++
RUN npm install -g pnpm@8.15.8 turbo@1.12.4

# Do ARG stuff
ARG SCRIPT_PATH="./"
ENV SCRIPT_PATH ${SCRIPT_PATH}

ARG TURBO_TOKEN
ARG TURBO_TEAM

# Copy the repo into the build context
WORKDIR /workdir/repo
COPY . .

RUN ls

# Prune unneeded packages
# Need to pull the package name from the path
RUN turbo prune --out-dir=../pruned --scope=$(pnpm list --depth -1 --parseable --long --filter "./$SCRIPT_PATH" | grep -oP '(?<=\:)(.*(?=@))') 

WORKDIR /workdir/pruned
# Can delete the previous workdir, won't be needed anymore
RUN rm -rf /workdir/repo

RUN HUSKY=0 pnpm install
RUN pnpm exec turbo run build --filter="./$SCRIPT_PATH"

# Delete store path since it's now unneeded, to reduce image size
RUN rm -rf $(pnpm store path)

EXPOSE 8080/tcp
CMD pnpm exec turbo run start --only --filter="./$SCRIPT_PATH"