import { graphql } from '../graphql'

export const PoolFieldsFragment = graphql(`
  fragment PoolFields on Pair @_unmask {
    id
    token0 {
      name
      id
      decimals
      symbol
    }
    token1 {
      name
      id
      decimals
      symbol
    }
    createdAtBlockNumber
    createdAtTimestamp
    reserve0
    reserve1
    totalSupply
    liquidityUSD: reserveUSD
    # token0Price
    # token1Price
    volumeUSD
    txCount
  }
`)
