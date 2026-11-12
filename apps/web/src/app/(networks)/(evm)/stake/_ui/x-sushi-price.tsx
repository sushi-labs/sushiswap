import { Button, SkeletonText } from '@sushiswap/ui'
import { useMemo, useState } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks/use-token-amount-dollar-values'
import { Amount, formatUSD } from 'sushi'
import { EvmChainId, SUSHI } from 'sushi/evm'
import { useSushiBar } from './sushi-bar-provider'

export const XSushiPrice = () => {
  const [invert, setInvert] = useState(true)
  const {
    totalSupply,
    sushiBalance,
    pricePer,
    pricePerInverted,
    isPricesLoading,
  } = useSushiBar()

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

  return (
    <div className="flex h-[26px] items-center">
      {isPricesLoading ? (
        <SkeletonText className="!w-2/4" />
      ) : (
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setInvert((invert) => !invert)}
          className="focus:bg-transparent"
        >
          <span className="flex items-baseline gap-1 whitespace-nowrap scroll hide-scrollbar">
            1 {invert ? 'SUSHI' : 'XSUSHI'}{' '}
            <span className="font-normal">
              ({formatUSD(invert ? sushiFiatPrice : xSushiFiatPrice)})
            </span>{' '}
            = {invert ? pricePerInverted : pricePer}{' '}
            {invert ? 'XSUSHI' : 'SUSHI'}{' '}
            <span className="font-normal">
              ({formatUSD(invert ? xSushiFiatPrice : sushiFiatPrice)})
            </span>
          </span>
        </Button>
      )}
    </div>
  )
}
