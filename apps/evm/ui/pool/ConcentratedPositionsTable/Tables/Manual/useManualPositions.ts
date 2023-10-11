'use client'

import {
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  isSushiSwapV3ChainId,
} from '@sushiswap/v3-sdk'
import { Address, useAccount } from '@sushiswap/wagmi'
import { useConcentratedLiquidityPositions } from '@sushiswap/wagmi/future/hooks'
import { useMemo } from 'react'
import { ChainId } from 'sushi/chain'
import { Writeable } from 'zod'

import { usePoolFilters } from '../../../PoolsFiltersProvider'

interface UseManualPositions {
  chainId?: ChainId
  poolAddress?: Address
}

export const useManualPositions = ({
  poolAddress,
  chainId,
}: UseManualPositions) => {
  const { address } = useAccount()
  const { chainIds, tokenSymbols } = usePoolFilters()

  const chainIdsToQuery = useMemo(() => {
    if (chainId && isSushiSwapV3ChainId(chainId)) {
      return [chainId]
    }

    return SUSHISWAP_V3_SUPPORTED_CHAIN_IDS
  }, [chainId])

  const { data: manualPositions, isInitialLoading } =
    useConcentratedLiquidityPositions({
      account: address,
      chainIds: chainIdsToQuery as Writeable<typeof chainIdsToQuery>,
    })

  return {
    data: useMemo(() => {
      const _tokenSymbols = tokenSymbols?.filter((el) => el !== '') || []
      return (manualPositions || [])
        ?.filter((el) => chainIds.includes(el.chainId))
        .filter((el) =>
          _tokenSymbols.length > 0
            ? _tokenSymbols.some((symbol) => {
                return [
                  el.pool?.token0.symbol,
                  el.pool?.token1.symbol,
                ].includes(symbol.toUpperCase())
              })
            : true,
        )
        .filter((el) => {
          return (
            el.liquidity !== 0n &&
            (poolAddress
              ? el.address.toLowerCase() === poolAddress.toLowerCase()
              : true)
          )
        })
    }, [tokenSymbols, manualPositions, chainIds, poolAddress]),
    isInitialLoading,
  }
}
