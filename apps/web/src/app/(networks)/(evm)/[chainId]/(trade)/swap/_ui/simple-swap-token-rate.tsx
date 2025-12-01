import { Button, SkeletonText } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Amount, Price, formatUSD } from 'sushi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

//@dev can also use useTradeQuote to get price directly from quote but this does not require the quote api call
export const SimpleSwapTokenRate = () => {
  const [invert, setInvert] = useState(false)
  const {
    state: { chainId, token0, token1 },
  } = useDerivedStateSimpleSwap()

  const amounts = useMemo(() => {
    if (!token0 || !token1) return undefined
    return [Amount.tryFromHuman(token0, '1'), Amount.tryFromHuman(token1, '1')]
  }, [token0, token1])

  const [token0FiatPrice, token1FiatPrice] = useTokenAmountDollarValues({
    chainId,
    amounts,
  })

  const { data: prices, isLoading: isPricesLoading } = usePrices({ chainId })

  const price = useMemo(() => {
    if (!token0 || !token1) return '0.00'

    const token0PriceFraction = prices?.getFraction(token0.wrap().address)
    const token0Price = token0PriceFraction
      ? Amount.tryFromHuman(token0, '1')?.mul(token0PriceFraction)
      : undefined

    const token1PriceFraction = prices?.getFraction(token1.wrap().address)
    const token1Price = token1PriceFraction
      ? Amount.tryFromHuman(token1, '1')?.mul(token1PriceFraction)
      : undefined

    let price
    if (token0Price?.amount && token1Price?.amount) {
      price = new Price({
        baseAmount: token0Price,
        quoteAmount: token1Price,
      })
    }

    return price
      ? invert
        ? price.invert().toString({ fixed: 6 })
        : price.toString({ fixed: 6 })
      : '0.00'
  }, [invert, prices, token0, token1])

  if (isPricesLoading) {
    return <SkeletonText fontSize="sm" className="!w-[100px]" />
  }

  return (
    <Button
      className="text-xs font-medium !gap-0.5 !px-0 hover:!bg-transparent focus:!bg-transparent"
      variant="ghost"
      size="xs"
      onClick={() => setInvert((prev) => !prev)}
    >
      1 {invert ? token0?.symbol : token1?.symbol} = {price}{' '}
      {invert ? token1?.symbol : token0?.symbol}
      <span className="text-gray-700 dark:text-slate-400 font-normal">
        ({formatUSD(invert ? token0FiatPrice : token1FiatPrice)})
      </span>
    </Button>
  )
}
