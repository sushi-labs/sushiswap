import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { parseUnits } from 'viem'
import { useAssetState, useBasisTradeAccountBalances } from '../trade-widget'

export const BasisTradeAmount: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const {
    state: {
      basisTradeAsset,
      basisTradeSize,
      maxTradeSizeLong,
      maxTradeSizeShort,
      tradeSide,
    },
  } = useAssetState()
  const {
    isLoading,
    spotBaseBalance,
    spotBaseSymbol,
    spotQuoteBalance,
    spotQuoteSymbol,
  } = useBasisTradeAccountBalances({ basisTradeAsset })

  const { isSizeValid, buttonText } = useMemo(() => {
    if (isLoading) {
      return { isSizeValid: false, buttonText: 'Loading Balances' }
    }

    if (!basisTradeAsset) {
      return { isSizeValid: false, buttonText: 'Select Basis Pair' }
    }

    if (
      Number(basisTradeSize.spot.base) === 0 ||
      Number(basisTradeSize.perp.base) === 0
    ) {
      return { isSizeValid: false, buttonText: 'Enter Sizes' }
    }

    if (Number(basisTradeSize.spot.quote) < 11) {
      return { isSizeValid: false, buttonText: 'Min. Spot Size is $11' }
    }

    if (Number(basisTradeSize.perp.quote) < 11) {
      return { isSizeValid: false, buttonText: 'Min. Perp Size is $11' }
    }

    if (tradeSide === 'long') {
      const availableQuote = Number(spotQuoteBalance?.availableBalance ?? 0)
      if (Number(basisTradeSize.spot.quote) > availableQuote) {
        return {
          isSizeValid: false,
          buttonText: `Insufficient ${spotQuoteSymbol}`,
        }
      }
    } else {
      const availableBase = Number(spotBaseBalance?.availableBalance ?? 0)
      if (Number(basisTradeSize.spot.base) > availableBase) {
        return {
          isSizeValid: false,
          buttonText: `Insufficient ${spotBaseSymbol}`,
        }
      }
    }

    const maxPerpTradeSize =
      tradeSide === 'long' ? maxTradeSizeShort : maxTradeSizeLong

    const parsedPerpSize = parseUnits(basisTradeSize.perp.base, 18)
    const parsedMaxPerpTradeSize = parseUnits(maxPerpTradeSize, 18)

    if (parsedPerpSize > parsedMaxPerpTradeSize) {
      return { isSizeValid: false, buttonText: 'Invalid Perp Size' }
    }

    return { isSizeValid: true, buttonText: '' }
  }, [
    basisTradeAsset,
    basisTradeSize,
    isLoading,
    maxTradeSizeLong,
    maxTradeSizeShort,
    spotBaseBalance,
    spotBaseSymbol,
    spotQuoteBalance,
    spotQuoteSymbol,
    tradeSide,
  ])

  if (!isSizeValid) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        {buttonText}
      </Button>
    )
  }

  return <>{children}</>
}
