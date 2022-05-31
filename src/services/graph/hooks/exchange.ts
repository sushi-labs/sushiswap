import { ChainId } from '@sushiswap/core-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import stringify from 'fast-json-stable-stringify'
import useSWR, { SWRConfiguration } from 'swr'

import {
  getAlcxPrice,
  getAvaxPrice,
  getBundle,
  getCeloPrice,
  getCvxPrice,
  getDayData,
  getFactory,
  getFantomPrice,
  getFusePrice,
  getGlimmerPrice,
  getGnoPrice,
  getLiquidityPositions,
  getMagicPrice,
  getMaticPrice,
  getMovrPrice,
  getMphPrice,
  getNativePrice,
  getOhmPrice,
  getOnePrice,
  getPairDayData,
  getPairs,
  getPicklePrice,
  getRulerPrice,
  getSpellPrice,
  getSushiPrice,
  getTokenDayData,
  getTokenPairs,
  getTokens,
  getTruPrice,
  getYggPrice,
} from '../fetchers'
import { GraphProps } from '../interfaces'
import { ethPriceQuery } from '../queries'

export function useFactory({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['factory', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getFactory(chainId, variables),
    swrConfig
  )
  return data
}

export function useNativePrice({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  return useSWR(
    shouldFetch ? ['nativePrice', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getNativePrice(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useEthPrice(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  return useSWR(['ethPrice'], () => getNativePrice(variables), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useGnoPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.XDAI
  return useSWR(shouldFetch ? 'gnoPrice' : null, () => getGnoPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useGlimmerPrice(swrConfig: SWRConfiguration = undefined) {
  return useSWR('glimmerPrice', () => getGlimmerPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useSpellPrice(swrConfig: SWRConfiguration = undefined) {
  return useSWR('spellPrice', () => getSpellPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useOnePrice(swrConfig: SWRConfiguration = undefined) {
  return useSWR(['onePrice'], () => getOnePrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useCeloPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.CELO
  return useSWR(shouldFetch ? 'celoPrice' : null, () => getCeloPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useFantomPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.FANTOM
  return useSWR(shouldFetch ? 'fantomPrice' : null, () => getFantomPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useMovrPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.MOONRIVER
  return useSWR(shouldFetch ? 'movrPrice' : null, () => getMovrPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useYggPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  return useSWR(shouldFetch ? ['yggPrice'] : null, () => getYggPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useRulerPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  return useSWR(shouldFetch ? ['rulerPrice'] : null, () => getRulerPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useTruPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  return useSWR(chainId && chainId === ChainId.ETHEREUM ? ['truPrice'] : null, () => getTruPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useAlcxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  return useSWR(shouldFetch ? ['aclxPrice'] : null, () => getAlcxPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useCvxPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  return useSWR(shouldFetch ? ['cvxPrice'] : null, () => getCvxPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function usePicklePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  return useSWR(shouldFetch ? ['picklePrice'] : null, () => getPicklePrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useMphPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ETHEREUM
  return useSWR(shouldFetch ? ['mphPrice'] : null, () => getMphPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useAvaxPrice(swrConfig: SWRConfiguration = undefined) {
  return useSWR(['avaxPrice'], () => getAvaxPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useMaticPrice(swrConfig: SWRConfiguration = undefined) {
  return useSWR(['maticPrice'], () => getMaticPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useSushiPrice(swrConfig: SWRConfiguration = undefined) {
  return useSWR(['sushiPrice'], () => getSushiPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useOhmPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  return useSWR(chainId ? 'ohmPrice' : null, () => getOhmPrice(chainId), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useFusePrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.FUSE
  return useSWR(shouldFetch ? 'fusePrice' : null, () => getFusePrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useMagicPrice(swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  const shouldFetch = chainId && chainId === ChainId.ARBITRUM
  return useSWR(shouldFetch ? 'magicPrice' : null, () => getMagicPrice(), swrConfig)
}

// @ts-ignore TYPE NEEDS FIXING
export function useBundle(variables = undefined, swrConfig: SWRConfiguration = undefined) {
  const { chainId } = useActiveWeb3React()
  return useSWR(chainId ? [chainId, ethPriceQuery, stringify(variables)] : null, () => getBundle(), swrConfig)
}

export function useLiquidityPositions({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['liquidityPositions', chainId, stringify(variables)] : null,
    (_, chainId) => getLiquidityPositions(chainId, variables),
    swrConfig
  )
  return data
}

export function useSushiPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  return useSWR(
    shouldFetch ? ['sushiPairs', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    (_, chainId) => getPairs(chainId, variables),
    swrConfig
  )
}

export function useTokens({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['tokens', chainId, stringify(variables)] : null,
    (_, chainId) => getTokens(chainId, variables),
    swrConfig
  )
  return data
}

export function usePairDayData({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['pairDayData', chainId, stringify(variables)] : null,
    (_, chainId) => getPairDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokenDayData(
  { chainId, variables, shouldFetch = true }: GraphProps,
  // @ts-ignore TYPE NEEDS FIXING
  swrConfig: SWRConfiguration = undefined
) {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['tokenDayData', chainId, stringify(variables)] : null,
    (_, chainId) => getTokenDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useDayData({ chainId, variables, shouldFetch = true, swrConfig = undefined }: GraphProps) {
  const { data } = useSWR(
    shouldFetch && !!chainId ? ['dayData', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    (_, chainId) => getDayData(chainId, variables),
    swrConfig
  )
  return data
}

export function useTokenPairs({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  const { data } = useSWR(
    shouldFetch ? ['tokenPairs', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    (_, chainId) => getTokenPairs(chainId, variables),
    swrConfig
  )
  return data
}
