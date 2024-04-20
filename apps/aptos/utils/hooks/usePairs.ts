import { SupportedNetwork, chains } from 'config/chains'
import { useMemo } from 'react'
import { Token } from '../tokenType'
import { useNetwork } from './useNetwork'
import { usePairsReserves } from './usePairsReserves'

export enum PairState {
  LOADING = 'Loading',
  NOT_EXISTS = 'Not Exists',
  EXISTS = 'Exists',
  INVALID = 'Invalid',
}

export type Pair = {
  liquidityToken: Token
  tokenAmounts: string[]
  token0: Token
  token1: Token
}

interface UsePairs {
  currencies: [Token | undefined, Token | undefined][]
  ledgerVersion?: number
}

export default function usePairs({
  currencies,
  ledgerVersion,
}: UsePairs): [PairState, Pair | null][] {
  const { network } = useNetwork()

  const tokens = useMemo(() => currencies.map(([a, b]) => [a, b]), [currencies])

  const pairAddresses = useMemo(
    () => [
      ...new Set(
        tokens.map(([tokenA, tokenB]) => {
          if (!tokenA || !tokenB || tokenA.address === tokenB.address) {
            return undefined
          }
          return getReservesAddress(tokenA, tokenB, network)
        }),
      ),
    ],
    [tokens, network],
  )
  const { data: pairReserves } = usePairsReserves({
    pairAddresses,
    ledgerVersion,
  })

  return useMemo(() => {
    return tokens.map(([tokenA, tokenB]) => {
      if (!tokenA || !tokenB || tokenA?.address === tokenB.address) {
        return [PairState.INVALID, null]
      }
      const pairReservesAddress = getReservesAddress(tokenA, tokenB, network)

      if (pairReserves?.[pairReservesAddress]) {
        const [token0, token1] = sortToken(tokenA, tokenB)
        return [
          PairState.EXISTS,
          getPair(
            token0,
            token1,
            pairReserves[pairReservesAddress].data.reserve_x,
            pairReserves[pairReservesAddress].data.reserve_y,
            network,
          ),
        ]
      }
      return [PairState.NOT_EXISTS, null]
    })
  }, [pairReserves, tokens, network])
}

export const getReservesAddress = (
  tokenA: Token,
  tokenB: Token,
  network: SupportedNetwork,
) => {
  const [token0, token1] = sortToken(tokenA, tokenB)
  return `${chains[network].contracts.swap}::swap::TokenPairReserve<${token0.address}, ${token1.address}>`
}

export const sortsBefore = (tokenA: Token, tokenB: Token) => {
  return tokenA?.address?.toLowerCase() < tokenB?.address?.toLowerCase()
}

export const sortToken = (tokenA: Token, tokenB: Token) => {
  const [token0, token1] = sortsBefore(tokenA, tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]
  return [token0, token1]
}

function getPair(
  token0: Token,
  token1: Token,
  currencyAmountA: string,
  tokenAmountB: string,
  network: SupportedNetwork,
) {
  const liquidityToken = getLiquidityToken(token0, token1, network)
  const tokenAmounts = sortsBefore(token0, token1)
    ? [currencyAmountA, tokenAmountB]
    : [tokenAmountB, currencyAmountA]
  return { liquidityToken, tokenAmounts, token0, token1 }
}

function getLiquidityToken(
  tokenA: Token,
  tokenB: Token,
  network: SupportedNetwork,
) {
  const [token0, token1] = sortToken(tokenA, tokenB)
  return {
    address: getAddress(tokenA, tokenB, network),
    decimals: 8,
    symbol: 'Sushi-LP',
    name: `sushi-${token0.symbol}-${token1.symbol}-LP`,
  }
}

function getAddress(tokenA: Token, tokenB: Token, network: SupportedNetwork) {
  const [token0, token1] = sortToken(tokenA, tokenB)
  return `${chains[network].contracts.swap}::swap::LPToken<${token0.address}, ${token1.address}>`
}
