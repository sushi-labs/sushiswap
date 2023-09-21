# Extractory library

## Load test

1. npx ts-node examples/server.ts 
2. npx artillery run test/load.yml

## Docker

docker build -f packages/extractor/Dockerfile . --no-cache