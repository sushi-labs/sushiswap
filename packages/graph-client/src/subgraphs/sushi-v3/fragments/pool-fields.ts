import { graphql } from '../graphql'

export const PoolFieldsFragment = graphql(`
  fragment PoolFields on Pool @_unmask {
    id
    token0 {
      id
      symbol
      name
      decimals
    }
    token1 {
      id
      symbol
      name
      decimals
    }

    isProtocolFeeEnabled

    swapFee: feeTier
    
    liquidity
    sqrtPrice
    feeGrowthGlobal0X128
    feeGrowthGlobal1X128
    token0Price
    token1Price
    tick
    observationIndex

    volumeToken0
    volumeToken1
    volumeUSD
    untrackedVolumeUSD
    
    feesUSD
    collectedFeesToken0
    collectedFeesToken1
    collectedFeesUSD
    
    reserve0: totalValueLockedToken0
    reserve1: totalValueLockedToken1
    liquidityUSD: totalValueLockedUSD
    untrackedLiquidityUSD: totalValueLockedUSDUntracked
    
    liquidityProviderCount
    txCount

    createdAtTimestamp
    createdAtBlockNumber
  }
`)
