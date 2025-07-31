'use client'

import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { Button, typographyVariants } from '@sushiswap/ui'
import { SkeletonText } from '@sushiswap/ui'
import React, { useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Amount, Price, formatUSD } from 'sushi'
import { EvmToken } from 'sushi/evm'

import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapHeader = () => {
  const [invert, setInvert] = useState(false)
  const {
    state: { chainId0, chainId1, token0, token1 },
    isLoading,
  } = useDerivedStateCrossChainSwap()

  const amounts = useMemo(() => {
    return token0 && token1
      ? [[Amount.fromHuman(token0, '1')], [Amount.fromHuman(token1, '1')]]
      : [[], []]
  }, [token0, token1])

  const [token0FiatPrice] = useTokenAmountDollarValues({
    chainId: chainId0,
    amounts: amounts[0],
  })
  const [token1FiatPrice] = useTokenAmountDollarValues({
    chainId: chainId1,
    amounts: amounts[1],
  })

  const { data: prices0 } = usePrices({ chainId: chainId0 })
  const { data: prices1 } = usePrices({ chainId: chainId1 })

  const price = useMemo(() => {
    if (!token0 || !token1) return '0.00'

    // To make sure both tokens have same chainId when creating the price entity
    const dummy0 = new EvmToken({
      address: token0.wrap().address,
      chainId: 1,
      decimals: token0.decimals,
      name: token0.name,
      symbol: token0.symbol,
    })
    const dummy1 = new EvmToken({
      address: token1.wrap().address,
      chainId: 1,
      decimals: token1.decimals,
      name: token1.name,
      symbol: token1.symbol,
    })

    const _token0Price = prices0?.getFraction(token0.wrap().address)
    const token0Price = _token0Price
      ? Amount.fromHuman(token0, '1')?.mul(_token0Price)
      : undefined

    const _token1Price = prices1?.getFraction(token1.wrap().address)
    const token1Price = _token1Price
      ? Amount.fromHuman(token1, '1')?.mul(_token1Price)
      : undefined

    let price
    if (token0Price && token1Price) {
      price = new Price({
        baseAmount: new Amount(dummy0, token0Price.amount.toString()),
        quoteAmount: new Amount(dummy1, token1Price.amount.toString()),
      })
    }

    return price
      ? invert
        ? price.invert().toSignificant(4)
        : price.toSignificant(4)
      : '0.00'
  }, [invert, prices0, prices1, token0, token1])

  return (
    <div className="flex flex-col items-start gap-2 mb-4 sm:mt-10 mt-2">
      <h1 className={typographyVariants({ variant: 'h1' })}>Trade</h1>
      {isLoading || !token0 || !token1 ? (
        <SkeletonText fontSize="sm" className="w-2/4" />
      ) : (
        <Button
          variant="link"
          size="sm"
          onClick={() => setInvert((invert) => !invert)}
        >
          <ArrowTrendingUpIcon width={16} height={16} />
          <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
            1 {invert ? token0.symbol : token1.symbol}{' '}
            <span className="font-normal">
              ({formatUSD(invert ? token0FiatPrice : token1FiatPrice)})
            </span>{' '}
            = {price} {invert ? token1.symbol : token0.symbol}{' '}
            <span className="font-normal">
              ({formatUSD(invert ? token1FiatPrice : token0FiatPrice)})
            </span>
          </span>
        </Button>
      )}
    </div>
  )
}
