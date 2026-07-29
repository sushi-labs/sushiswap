'use client'

import { useMemo } from 'react'
import { usePrices } from 'src/app/(networks)/(evm)/_common/ui/price-provider/price-provider/use-prices'
import { isAddressFeeWhitelisted } from 'src/lib/swap/fee'
import { EvmChainId, WNATIVE_ADDRESS } from 'sushi/evm'
import { useConnection } from 'wagmi'
import type { UseDirectPoolTradeParams } from './types'
import { isDirectPoolPair } from './utils'

export function useDirectPoolContext(
  params: UseDirectPoolTradeParams,
  fee: number,
) {
  const { address } = useConnection()
  const { chainId, directPool, enabled, recipient } = params
  const eligible = isDirectPoolPair(params)
  const supportedChainId =
    chainId === EvmChainId.ROBINHOOD ? chainId : undefined
  const effectiveFee =
    address &&
    isAddressFeeWhitelisted(address) &&
    (!recipient || isAddressFeeWhitelisted(recipient))
      ? 0
      : fee

  const { data: prices } = usePrices({
    chainId,
    enabled: Boolean(enabled && directPool && eligible),
  })
  const nativePrice = useMemo(() => {
    if (prices && chainId) {
      return prices.getFraction(WNATIVE_ADDRESS[chainId])
    }

    return undefined
  }, [chainId, prices])

  return {
    address,
    effectiveFee,
    eligible,
    nativePrice,
    supportedChainId,
  }
}
