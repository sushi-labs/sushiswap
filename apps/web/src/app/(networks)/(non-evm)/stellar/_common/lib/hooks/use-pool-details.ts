// import type { PoolState } from '@sushiswap/stellar/mock-pool'
import { useQuery } from '@tanstack/react-query'
import { baseTokens } from '../assets/tokens/testnet/baseTokens'
// import { getPoolDetails } from '../soroban/pool-helpers'
import type { IPool } from './use-pools'

interface UsePoolDetailsParams {
  address: string
}

export const usePoolDetails = ({ address }: UsePoolDetailsParams) => {
  return useQuery({
    queryKey: ['usePoolDetails', address],
    queryFn: () => {
      // const poolState: PoolState = await getPoolDetails(address)
      // TODO: fetch real contract data
      const xlm = baseTokens.find((token) => token.code === 'XLM')
      const usdc = baseTokens.find((token) => token.domain === 'centre.io')
      if (!xlm || !usdc) {
        throw new Error('XLM or USDC not found')
      }
      const pool: IPool = {
        name: 'XLM/USDC',
        address: address,
        token0Address: xlm.contract ?? '-',
        token1Address: usdc.contract ?? '-',
        token0: xlm,
        token1: usdc,
        liquidityUSD: 0,
        volumeUSD1d: 0,
        feeUSD1d: 0,
        txCount1d: 0,
        totalApr1d: 0,
      }

      return pool
    },
    enabled: !!address, // Only run query if address is provided
  })
}
