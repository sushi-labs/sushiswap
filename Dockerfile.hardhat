FROM node:16

WORKDIR /app

RUN git clone https://github.com/sushiswap/trident .
RUN yarn
RUN npx hardhat compile
CMD npx hardhat node