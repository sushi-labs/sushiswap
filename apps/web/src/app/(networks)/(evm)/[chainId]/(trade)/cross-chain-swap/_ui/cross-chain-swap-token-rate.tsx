import { Button, SkeletonText } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Amount, Price, formatUSD } from 'sushi'
import { EvmToken } from 'sushi/evm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapTokenRate = () => {
  const [invert, setInvert] = useState(false)
  const {
    state: { chainId0, chainId1, token0, token1 },
    isLoading,
  } = useDerivedStateCrossChainSwap()

  const amounts = useMemo(() => {
    if (!token0 || !token1) return undefined
    return [Amount.tryFromHuman(token0, '1'), Amount.tryFromHuman(token1, '1')]
  }, [token0, token1])

  const [token0FiatPrice] = useTokenAmountDollarValues({
    chainId: chainId0,
    amounts: [amounts?.[0]],
  })
  const [token1FiatPrice] = useTokenAmountDollarValues({
    chainId: chainId1,
    amounts: [amounts?.[1]],
  })

  const { data: prices0, isLoading: isPrices0Loading } = usePrices({
    chainId: chainId0,
  })
  const { data: prices1, isLoading: isPrices1Loading } = usePrices({
    chainId: chainId1,
  })

  const price = useMemo(() => {
    if (!token0 || !token1) return '0.00'

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
      name: token0.name,
      symbol: token0.symbol,
    })

    const token0PriceFraction = prices0?.getFraction(token0.wrap().address)
    const token0Price = token0PriceFraction
      ? Amount.tryFromHuman(token0, '1')?.mul(token0PriceFraction)
      : undefined

    const token1PriceFraction = prices1?.getFraction(token1.wrap().address)
    const token1Price = token1PriceFraction
      ? Amount.tryFromHuman(token1, '1')?.mul(token1PriceFraction)
      : undefined

    let price
    if (token0Price?.amount && token1Price?.amount) {
      // price = new Price({
      //   baseAmount: token0Price,
      //   quoteAmount: token1Price,
      // })
      price = new Price({
        baseAmount: new Amount(dummy0, token0Price.amount),
        quoteAmount: new Amount(dummy1, token1Price.amount),
      })
    }

    return price
      ? invert
        ? price.invert().toString({ fixed: 6 })
        : price.toString({ fixed: 6 })
      : '0.00'
  }, [invert, prices0, prices1, token0, token1])

  if (isPrices0Loading || isPrices1Loading || isLoading) {
    return <SkeletonText fontSize="sm" className="!w-[100px]" />
  }

  return (
    <Button
      className="!text-xs !font-medium !gap-0.5 !px-0 hover:!bg-transparent focus:!bg-transparent"
      variant="ghost"
      size="xs"
      onClick={() => setInvert((prev) => !prev)}
    >
      1 {invert ? token0?.symbol : token1?.symbol} = {price}{' '}
      {invert ? token1?.symbol : token0?.symbol}
      <span className="text-gray-600 dark:text-slate-500 !font-normal">
        ({formatUSD(invert ? token0FiatPrice : token1FiatPrice)})
      </span>
    </Button>
  )
}
