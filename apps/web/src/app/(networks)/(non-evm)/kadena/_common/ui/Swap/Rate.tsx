import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { Button, FormattedNumber, SkeletonText } from '@sushiswap/ui'
import { useState } from 'react'
import { formatUSD } from 'sushi/format'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'
import { useTokenPrice } from '~kadena/_common/lib/hooks/use-token-price'
import { useSwapState } from '~kadena/swap/swap-provider'

export const Rate = () => {
  const { token0, token1 } = useSwapState()
  const [invert, setInvert] = useState(false)

  const { data: priceUsd0, isLoading: isLoadingPrice0 } = useTokenPrice({
    token: token0,
  })
  const { data: priceUsd1, isLoading: isLoadingPrice1 } = useTokenPrice({
    token: token1,
  })

  const { data, isLoading: isLoadingPool } = usePoolFromTokens({
    token0: token0?.tokenAddress,
    token1: token1?.tokenAddress,
  })

  const isLoading = isLoadingPrice0 || isLoadingPrice1 || isLoadingPool

  const token0FiatPrice = priceUsd0 ?? 0
  const token1FiatPrice = priceUsd1 ?? 0
  const price = !invert
    ? (data?.poolData?.rateOfToken0ToToken1 ?? 0)
    : (data?.poolData?.rateOfToken1ToToken0 ?? 0)

  if (!token0 || !token1 || isLoading) {
    return <SkeletonText fontSize="sm" className="w-2/4" />
  }
  return (
    <Button
      variant="link"
      size="sm"
      onClick={() => setInvert((invert) => !invert)}
    >
      <ArrowTrendingUpIcon width={16} height={16} />
      <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
        1 {invert ? token0.tokenSymbol : token1.tokenSymbol}{' '}
        <span className="font-normal">
          ({formatUSD(invert ? token0FiatPrice : token1FiatPrice)})
        </span>{' '}
        =
        <FormattedNumber number={price} />{' '}
        {invert ? token1.tokenSymbol : token0.tokenSymbol}{' '}
        <span className="font-normal">
          ({formatUSD(invert ? token1FiatPrice : token0FiatPrice)})
        </span>
      </span>
    </Button>
  )
}
