import { ArrowTrendingUpIcon } from '@heroicons/react/20/solid'
import { usePrices } from '@sushiswap/react-query'
import { Button, SkeletonText } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import { ChainId } from 'sushi/chain'
import { Price, SUSHI, SUSHI_ADDRESS, tryParseAmount } from 'sushi/currency'
import { formatUSD } from 'sushi/format'

export const XSushiPrice = ({
  totalSupply,
  sushiBalance,
}: { totalSupply: bigint | undefined; sushiBalance: bigint | undefined }) => {
  const [invert, setInvert] = useState(true)

  const amounts = useMemo(() => {
    return [tryParseAmount('1', SUSHI[ChainId.ETHEREUM])]
  }, [])

  const [sushiFiatPrice] = useTokenAmountDollarValues({
    chainId: ChainId.ETHEREUM,
    amounts,
  })

  const xSushiFiatPrice = useMemo(
    () =>
      sushiFiatPrice && sushiBalance && totalSupply
        ? (sushiFiatPrice * Number(sushiBalance)) / Number(totalSupply)
        : 0,
    [sushiBalance, totalSupply, sushiFiatPrice],
  )

  const { data: prices, isLoading: isPricesLoading } = usePrices({
    chainId: ChainId.ETHEREUM,
  })

  const price = useMemo(() => {
    const sushiPrice = prices?.[SUSHI_ADDRESS[ChainId.ETHEREUM]]
      ? tryParseAmount('1', SUSHI[ChainId.ETHEREUM])?.multiply(
          prices[SUSHI_ADDRESS[ChainId.ETHEREUM]],
        )
      : undefined
    const xSushiPrice =
      sushiPrice && totalSupply && sushiBalance
        ? sushiPrice.multiply(sushiBalance).divide(totalSupply)
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
