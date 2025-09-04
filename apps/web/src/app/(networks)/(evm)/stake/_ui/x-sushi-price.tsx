import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { Button, SkeletonText } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { Amount, Price, formatUSD } from 'sushi'
import { EvmChainId, type EvmCurrency, SUSHI, SUSHI_ADDRESS } from 'sushi/evm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'

export const XSushiPrice = ({
  totalSupply,
  sushiBalance,
}: {
  totalSupply: Amount<EvmCurrency> | undefined
  sushiBalance: Amount<EvmCurrency> | undefined
}) => {
  const [invert, setInvert] = useState(true)

  const amounts = useMemo(() => {
    return [Amount.fromHuman(SUSHI[EvmChainId.ETHEREUM], '1')]
  }, [])

  const [sushiFiatPrice] = useTokenAmountDollarValues({
    chainId: EvmChainId.ETHEREUM,
    amounts,
  })

  const xSushiFiatPrice = useMemo(
    () =>
      sushiFiatPrice && sushiBalance && totalSupply
        ? sushiFiatPrice * Number(sushiBalance.amount / totalSupply.amount)
        : 0,
    [sushiBalance, totalSupply, sushiFiatPrice],
  )

  const { data: prices, isLoading: isPricesLoading } = usePrices({
    chainId: EvmChainId.ETHEREUM,
  })

  const price = useMemo(() => {
    const _sushiPrice = prices?.getFraction(SUSHI_ADDRESS[EvmChainId.ETHEREUM])

    const sushiPrice =
      _sushiPrice !== undefined
        ? Amount.fromHuman(SUSHI[EvmChainId.ETHEREUM], '1')?.mul(_sushiPrice)
        : undefined

    const xSushiPrice =
      sushiPrice && totalSupply && sushiBalance
        ? sushiPrice.mul(sushiBalance.amount).div(totalSupply.amount)
        : undefined

    let price
    if (sushiPrice && xSushiPrice) {
      price = new Price({
        baseAmount: sushiPrice,
        quoteAmount: xSushiPrice,
      })
    }

    return price
      ? invert
        ? price.invert().toSignificant(4)
        : price.toSignificant(4)
      : '0.00'
  }, [invert, prices, totalSupply, sushiBalance])

  return isPricesLoading ? (
    <SkeletonText fontSize="sm" className="w-2/4" />
  ) : (
    <Button
      variant="link"
      size="sm"
      onClick={() => setInvert((invert) => !invert)}
    >
      <ArrowTrendingUpIcon width={16} height={16} />
      <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
        1 {invert ? 'SUSHI' : 'XSUSHI'}{' '}
        <span className="font-normal">
          ({formatUSD(invert ? sushiFiatPrice : xSushiFiatPrice)})
        </span>{' '}
        = {price} {invert ? 'XSUSHI' : 'SUSHI'}{' '}
        <span className="font-normal">
          ({formatUSD(invert ? xSushiFiatPrice : sushiFiatPrice)})
        </span>
      </span>
    </Button>
  )
}
