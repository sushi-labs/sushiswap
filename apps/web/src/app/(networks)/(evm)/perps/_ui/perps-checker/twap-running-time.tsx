import { Button, type ButtonProps } from '@sushiswap/ui'
import { type FC, useMemo } from 'react'
import { useAssetState } from '../trade-widget'

export const TwapRunningTime: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const {
    state: { totalRunningTimeInMinutes, tradeType },
  } = useAssetState()

  const { isTimeValid, buttonText } = useMemo(() => {
    if (tradeType !== 'TWAP') {
      return { isTimeValid: true, buttonText: '' }
    }
    if (totalRunningTimeInMinutes < 5) {
      return { isTimeValid: false, buttonText: 'Running Time Too Low' }
    }
    if (totalRunningTimeInMinutes > 1440) {
      return { isTimeValid: false, buttonText: 'Running Time Too High' }
    }
    return { isTimeValid: true, buttonText: '' }
  }, [totalRunningTimeInMinutes, tradeType])

  if (!isTimeValid) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        {buttonText}
      </Button>
    )
  }

  return <>{children}</>
}
