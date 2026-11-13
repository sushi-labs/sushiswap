import { useMemo, useState } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { useTokenAmountDollarValues } from 'src/lib/hooks/use-token-amount-dollar-values'
import { Amount, Price, formatUSD } from 'sushi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { TokenRate } from '../../../_ui/token-rate'
import { useLifiXSwap } from './xswap-provider'

export function CrossChainSwapTokenRate<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const [invert, setInvert] = useState(false)
  const {
    state: { chainId0, chainId1, token0, token1 },
    isLoading,
  } = useLifiXSwap<TChainId0, TChainId1>()

  const amounts = useMemo(() => {
    if (!token0 || !token1) return undefined
    return [
      Amount.tryFromHuman(token0, '1'),
      Amount.tryFromHuman(token1, '1'),
    ] as const
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

    const token0PriceFraction = prices0?.getFraction(
      token0.wrap().address as ContractAddressFor<TChainId0>,
    )
    const token0Price = token0PriceFraction
      ? Amount.tryFromHuman(token0, '1')?.mul(token0PriceFraction)
      : undefined

    const token1PriceFraction = prices1?.getFraction(
      token1.wrap().address as ContractAddressFor<TChainId1>,
    )
    const token1Price = token1PriceFraction
      ? Amount.tryFromHuman(token1, '1')?.mul(token1PriceFraction)
      : undefined

    let price
    if (token0Price?.amount && token1Price?.amount) {
      price = new Price({
        baseAmount: new Amount(token0, token0Price.amount),
        quoteAmount: new Amount(token1, token1Price.amount),
      })
    }

    return price
      ? invert
        ? price.invert().toString({ fixed: 6 })
        : price.toString({ fixed: 6 })
      : '0.00'
  }, [invert, prices0, prices1, token0, token1])

  return (
    <TokenRate
      baseSymbol={invert ? token0?.symbol : token1?.symbol}
      quoteSymbol={invert ? token1?.symbol : token0?.symbol}
      rate={price}
      fiatValue={formatUSD(invert ? token0FiatPrice : token1FiatPrice)}
      isLoading={isPrices0Loading || isPrices1Loading || isLoading}
      onInvert={() => setInvert((prev) => !prev)}
    />
  )
}
