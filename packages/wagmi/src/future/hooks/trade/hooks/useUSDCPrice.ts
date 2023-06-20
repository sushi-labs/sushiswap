import { useMemo } from 'react'
import { useFeeData } from 'wagmi'
import { Amount, Price, Type, USDC } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'
import { useQuery } from '@tanstack/react-query'
import { usePoolsCodeMap } from '../../pools'
import { Router } from '@sushiswap/router'
import { ZERO } from '@sushiswap/math'
import { parseUnits } from 'ethers/lib/utils.js'

export const useUSDCPrice = ({
  currency,
  chainId,
  enabled = true,
}: {
  currency: Type | undefined
  chainId: ChainId | undefined
  enabled?: boolean
}) => {
  const { usdc, usdcIn } = useMemo(() => {
    const usdc =
      chainId && chainId in USDC
        ? USDC[chainId as keyof typeof USDC]
        : undefined

    return {
      usdc,
      usdcIn: usdc ? parseUnits('1000', usdc.decimals) : undefined,
    }
  }, [chainId])

  const { data: feeData } = useFeeData({ chainId: chainId })

  const _chainId = chainId || 1

  const { data: poolsCodeMap } = usePoolsCodeMap({
    chainId: _chainId,
    currencyA: usdc,
    currencyB: currency,
    enabled: Boolean(chainId && usdc && currency),
    withBentoPools: true,
  })

  return useQuery({
    queryKey: [
      'useUSDCPrice',
      {
        chainId,
        currency,
        poolsCodeMap,
      },
    ],
    queryFn: async () => {
      if (
        !chainId ||
        !poolsCodeMap ||
        !usdc ||
        !usdcIn ||
        !currency ||
        !feeData?.gasPrice
      )
        throw new Error('useUSDCPrice: Invalid input')

      if (currency.equals(usdc)) {
        const amount = Amount.fromRawAmount(usdc, usdcIn.toString())
        return new Price({ baseAmount: amount, quoteAmount: amount })
      }

      const route = Router.findBestRoute(
        poolsCodeMap,
        chainId,
        usdc,
        usdcIn,
        currency,
        feeData.gasPrice.toNumber(),
      )

      if (route) {
        const amountOut = Amount.fromRawAmount(
          currency,
          route.amountOutBN.toString(),
        )
        const amountIn = Amount.fromRawAmount(usdc, route.amountInBN.toString())

        if (amountOut.greaterThan(ZERO)) return new Price({ baseAmount: amountOut, quoteAmount: amountIn })
      }

      throw Error(`useUSDCPrice: Unable to calculate USDC price for ${currency.name}`)
    },
    refetchInterval: 10000,
    enabled: Boolean(
      enabled && chainId && poolsCodeMap && feeData && usdcIn && currency,
    ),
  })
}
