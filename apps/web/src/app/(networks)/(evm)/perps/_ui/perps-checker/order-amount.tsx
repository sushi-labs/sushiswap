import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useUserPositions } from 'src/lib/perps/use-user-positions'
import { parseUnits } from 'viem'
import { useAssetState } from '../trade-widget/asset-state-provider'

export const OrderAmount: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'default',
  ...props
}) => {
  const {
    state: {
      maxTradeSize,
      size: orderSize,
      reduceOnly,
      activeAsset,
      tradeSide,
    },
  } = useAssetState()
  const { data: existingPositions } = useUserPositions(activeAsset)

  const existingOppositePosition = useMemo(() => {
    if (!existingPositions || existingPositions.length === 0) return undefined
    return existingPositions?.find(
      (i) =>
        i.position.coin === activeAsset &&
        i.side === (tradeSide === 'long' ? 'A' : 'B'),
    )
  }, [existingPositions, activeAsset, tradeSide])

  const { isSizeValid, buttonText } = useMemo(() => {
    if (!existingOppositePosition && reduceOnly) {
      return { isSizeValid: false, buttonText: 'Reduce Only Too Large' }
    }
    if (reduceOnly && Number(maxTradeSize) === 0) {
      return { isSizeValid: false, buttonText: 'Reduce Only Too Large' }
    }
    if (Number(orderSize.base) === 0) {
      return { isSizeValid: false, buttonText: 'Enter Size' }
    }
    if (Number(orderSize.quote) < 10) {
      return { isSizeValid: false, buttonText: 'Min. Size is $10' }
    }
    const parsedSize = parseUnits(orderSize.base, 18)
    const parsedMaxTradeSize = parseUnits(maxTradeSize, 18)
    if (parsedSize <= parsedMaxTradeSize) {
      return { isSizeValid: true, buttonText: '' }
    }
    return { isSizeValid: false, buttonText: 'Invalid Order Size' }
  }, [maxTradeSize, orderSize, reduceOnly, existingOppositePosition])

  if (!isSizeValid) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        {buttonText}
      </Button>
    )
  }

  return <>{children}</>
}
