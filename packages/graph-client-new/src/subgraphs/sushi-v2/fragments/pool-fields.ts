import { graphql } from '../graphql'

export const PoolFieldsFragment = graphql(`
  fragment PoolFields on Pair @_unmask {
    id
    type
    swapFee
    twapEnabled
    name
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
    source
    createdAtBlock
    createdAtTimestamp
    reserve0
    reserve1
    liquidity
    liquidityUSD
    liquidityNative
    volumeUSD
    volumeNative
    volumeToken0
    volumeToken1
    feesNative
    feesUSD
    txCount
    apr
    aprUpdatedAtTimestamp
  }
`)
