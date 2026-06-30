import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useAssetState, useBasisTradeAccountBalances } from '../trade-widget'

export const BasisTradeAmount: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const {
    state: { basisTradeAsset, basisTradeSize, tradeSide },
  } = useAssetState()
  const {
    isLoading,
    perpsBalance,
    perpQuoteSymbol,
    spotBaseBalance,
    spotBaseSymbol,
    spotEquity,
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
      if (Number(basisTradeSize.spot.quote) > spotEquity) {
        return {
          isSizeValid: false,
          buttonText: 'Insufficient Spot Equity',
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

    if (Number(basisTradeSize.perp.quote) > Number(perpsBalance ?? 0)) {
      return {
        isSizeValid: false,
        buttonText: `Insufficient ${perpQuoteSymbol} Perp Balance`,
      }
    }

    return { isSizeValid: true, buttonText: '' }
  }, [
    basisTradeAsset,
    basisTradeSize,
    isLoading,
    perpsBalance,
    perpQuoteSymbol,
    spotBaseBalance,
    spotBaseSymbol,
    spotEquity,
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
