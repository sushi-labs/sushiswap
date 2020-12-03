# Queries

This page provides various query examples.

You can test any of the queries, or write your own, on the [SushiSwap Subgraph Explorer](https://thegraph.com/explorer/subgraph/zippoxer/sushiswap-subgraph-fork).

## Factory

### All-time liquidity, volume, and transactions

This query gets a factory by its id \(factory address\), which in this case is the SushiSwap Factory contract address.

```graphql
{
 factory(
  id: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"
 ) {
  volumeUSD
  liquidityUSD
  txCount
 }
}
```

## Bundle

### Ethereum Price

This query gets a bundle by its id, which in this case is "1".

```graphql
{
 bundle(
  id: "1" 
 ) { 
  ethPrice 
 }
}
```

## Pair

### Pair by ID

This query gets a pair by its id \(contract address\), which in this case is the SUSHI/ETH pair contract address.

```graphql
{
 pair(
  id: "0x795065dcc9f64b5614c407a6efdc400da6221fb0"
 ) {
  id
  token0 {
   id
   symbol
  }
  token1 {
   id
   symbol
  }
 }
}
```

### Pairs

This query lists the first 1000 pairs.

```graphql
{
 pairs(
  first: 1000
 ) {
  id
 }
}
```

### **Pairs ordered by liquidity**

This query lists the first 1000 pairs, ordered by liquidity in descending direction.

```graphql
{
 pairs(
  first: 1000, 
  orderBy: reserveUSD, 
  orderDirection: desc
 ) {
  id
 }
}
```

### Subset of Pairs

This query gets a subset of pairs where id is in an array of ids \(pair contract addresses\), which in this case are the addresses of the SUSHI/ETH and SUSHI/USDT pairs.

```graphql
{
 pairs(
  where: {
   id_in: [
    "0x795065dcc9f64b5614c407a6efdc400da6221fb0",
    "0x680a025da7b1be2c204d7745e809919bce074026"
   ]
  }
 ) {
  id
  token0 {
   id
   symbol
  }
  token1 {
   id
   symbol
  }
 }
}
```

## Pair Day Data

This query lists pair day data, where the pairAddress is the SUSHI/ETH pair contract address, ordered by date in ascending direction.

```graphql
{
 pairDayDatas(
  orderBy: date, 
  orderDirection: asc,
  where: {
   pairAddress: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
 ) {
  id
  date
  volumeUSD
 }
}
```

## Token

### Token by ID

This query gets a token by its id \(contract address\), which in this case is the SUSHI token contract address.

```graphql
{
 token(
  id: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"
 ) {
  name
  symbol
  decimals
  derivedETH
  volumeUSD
  liquidity
 }
}
```

### Tokens

This query lists the first 1000 tokens.

```graphql
{
 tokens(
  first: 1000
 ) {
  id
 }
}
```

### Tokens ordered by volume

This query lists the first 1000 tokens, ordered by volume in descending direction.

```graphql
{
 tokens(
  first: 1000, 
  orderBy: tradeVolumeUSD, 
  orderDirection: desc
 ) {
  id
 }
}
```

### Subset of Tokens

This query gets a subset of tokens where id is in an array of ids \(token contract addresses\), which in this case are the addresses of the Sushi and Ethereum token.

```graphql
{
 tokens(
  where: {
   id_in: [
    "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
   ]
  }
 ) {
  id
  symbol
 }
}
```

## Token Day Data

This query lists token day data, where the token is the SUSHI token contract address, ordered by date in ascending direction.

```graphql
{
 tokenDayDatas(
  orderBy: date, 
  orderDirection: asc,
  where: {
   token: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"
  }
 ) {
  id
  date
  volumeToken
  volumeETH
  volumeUSD
  txCount
  liquidityToken
  liquidityETH
  liquidityUSD
  priceUSD
 }
}
```

## User

### User by ID

This query gets a user by its id \(user address\).

```graphql
{
 user(
  id: "..."
 ) {
  id
 }
}
```

### Users

This query lists the first 1000 users.

```graphql
{
 users(
  first: 1000
 ) {
  id
 }
}
```

### Subset of Users

This query gets a subset of users where id is in an array of ids \(user addresses\).

```graphql
{
 users(
  where: { id_in: [ "one", "two", "three" ] }
 ) {
  id
 }
}
```



