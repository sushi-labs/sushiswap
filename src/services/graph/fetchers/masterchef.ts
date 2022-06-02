import { ChainId } from '@sushiswap/core-sdk'
import { GRAPH_HOST } from 'app/services/graph/constants'
import { getTokenSubset } from 'app/services/graph/fetchers/exchange'
import {
  masterChefV1PairAddressesQuery,
  masterChefV1PoolHistoriesQuery,
  masterChefV1PoolsQuery,
  masterChefV1SushiPerBlockQuery,
  masterChefV1TotalAllocPointQuery,
  masterChefV2PairAddressesQuery,
  masterChefV2PoolsQuery,
  miniChefPairAddressesQuery,
  miniChefPoolsQuery,
  miniChefPoolsQueryV2,
  poolsQuery,
  poolsV2Query,
} from 'app/services/graph/queries'
import { request } from 'graphql-request'

export const MINICHEF = {
  [ChainId.MATIC]: 'jiro-ono/minichef-staging-updates',
  [ChainId.XDAI]: 'sushiswap/xdai-minichef',
  [ChainId.HARMONY]: 'sushiswap/harmony-minichef',
  [ChainId.ARBITRUM]: 'jiro-ono/arbitrum-minichef-staging',
  [ChainId.CELO]: 'sushiswap/celo-minichef-v2',
  [ChainId.MOONRIVER]: 'sushiswap/moonriver-minichef',
  [ChainId.FUSE]: 'sushiswap/fuse-minichef',
  [ChainId.FANTOM]: 'sushiswap/fantom-minichef',
  [ChainId.MOONBEAM]: 'sushiswap/moonbeam-minichef',
}

export const OLD_MINICHEF = {
  [ChainId.CELO]: 'sushiswap/celo-minichef',
}

// @ts-ignore TYPE NEEDS FIXING
export const miniChef = async (query, chainId = ChainId.ETHEREUM, variables = undefined) =>
  // @ts-ignore TYPE NEEDS FIXING
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MINICHEF[chainId]}`, query, variables)

// @ts-ignore TYPE NEEDS FIXING
export const oldMiniChef = async (query, chainId = ChainId.ETHEREUM) =>
  // @ts-ignore TYPE NEEDS FIXING
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${OLD_MINICHEF[chainId]}`, query)

export const MASTERCHEF_V2 = {
  [ChainId.ETHEREUM]: 'sushiswap/master-chefv2',
}

// @ts-ignore TYPE NEEDS FIXING
export const masterChefV2 = async (query, chainId = ChainId.ETHEREUM, variables = undefined) =>
  // @ts-ignore TYPE NEEDS FIXING
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V2[chainId]}`, query, variables)

export const MASTERCHEF_V1 = {
  [ChainId.ETHEREUM]: 'sushiswap/master-chef',
}

// @ts-ignore TYPE NEEDS FIXING
export const masterChefV1 = async (query, chainId = ChainId.ETHEREUM, variables = undefined) =>
  // @ts-ignore TYPE NEEDS FIXING
  request(`${GRAPH_HOST[chainId]}/subgraphs/name/${MASTERCHEF_V1[chainId]}`, query, variables)

export const getMasterChefV1TotalAllocPoint = async () => {
  const {
    masterChef: { totalAllocPoint },
  } = await masterChefV1(masterChefV1TotalAllocPointQuery)
  return totalAllocPoint
}

export const getMasterChefV1SushiPerBlock = async () => {
  const {
    masterChef: { sushiPerBlock },
  } = await masterChefV1(masterChefV1SushiPerBlockQuery)
  return sushiPerBlock / 1e18
}

export const getMasterChefV1Farms = async (variables = undefined) => {
  const { pools } = await masterChefV1(poolsQuery, undefined, variables)
  return pools
}

export const getMasterChefV1PairAddreses = async () => {
  const { pools } = await masterChefV1(masterChefV1PairAddressesQuery)
  // @ts-ignore
  return pools?.map((pool) => pool.pair)
}

export const getMasterChefV2Farms = async (variables = undefined) => {
  const { pools } = await masterChefV2(poolsV2Query, undefined, variables)

  const tokens = await getTokenSubset(ChainId.ETHEREUM, {
    // @ts-ignore TYPE NEEDS FIXING
    tokenAddresses: Array.from(pools.map((pool) => pool.rewarder.rewardToken)),
  })

  // @ts-ignore TYPE NEEDS FIXING
  return pools.map((pool) => ({
    ...pool,
    rewardToken: {
      // @ts-ignore TYPE NEEDS FIXING
      ...tokens.find((token) => token.id === pool.rewarder.rewardToken),
    },
  }))
}

export const getMasterChefV2PairAddreses = async () => {
  const { pools } = await masterChefV2(masterChefV2PairAddressesQuery)
  // @ts-ignore
  return pools?.map((pool) => pool.pair)
}

export const getOldMiniChefFarms = async (chainId = ChainId.ETHEREUM) => {
  const { pools } = await oldMiniChef(miniChefPoolsQuery, chainId)
  return pools
}

export const getMiniChefFarms = async (chainId = ChainId.ETHEREUM, variables = undefined) => {
  const v2Query = chainId && [ChainId.MATIC, ChainId.ARBITRUM].includes(chainId)

  if (v2Query) {
    const { pools } = await miniChef(miniChefPoolsQueryV2, chainId, variables)
    const tokens = await getTokenSubset(chainId, {
      // @ts-ignore TYPE NEEDS FIXING
      tokenAddresses: Array.from(pools.map((pool) => pool.rewarder.rewardToken)),
    })

    // @ts-ignore TYPE NEEDS FIXING
    return pools.map((pool) => ({
      ...pool,
      rewardToken: {
        // @ts-ignore TYPE NEEDS FIXING
        ...tokens.find((token) => token.id === pool.rewarder.rewardToken),
      },
    }))
  } else {
    const { pools } = await miniChef(miniChefPoolsQuery, chainId, variables)
    return pools
  }
}

export const getMiniChefPairAddreses = async (chainId = ChainId.ETHEREUM) => {
  console.debug('getMiniChefPairAddreses')
  const { pools } = await miniChef(miniChefPairAddressesQuery, chainId)
  // @ts-ignore
  return pools?.map((pool) => pool.pair)
}

export const getMasterChefV1Pools = async (chainId = ChainId.ETHEREUM, variables: any) => {
  const { pools } = await masterChefV1(masterChefV1PoolsQuery, chainId, variables)
  return pools
}

export const getMasterChefV2Pools = async (chainId = ChainId.ETHEREUM, variables: any) => {
  const { pools } = await masterChefV2(masterChefV2PoolsQuery, chainId, variables)
  return pools
}

export const getMasterChefV1PoolHistories = async (chainId = ChainId.ETHEREUM, variables: any) => {
  const { poolHistories } = await masterChefV1(masterChefV1PoolHistoriesQuery, chainId, variables)
  return poolHistories
}
