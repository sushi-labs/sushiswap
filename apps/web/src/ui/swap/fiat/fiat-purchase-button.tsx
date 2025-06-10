import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { Button } from '@sushiswap/ui'
import { useDerivedStateFiat } from './derivedstate-fiat-provider'

export const FiatPurchaseButton = () => {
  const {
    state: { swapAmountString },
  } = useDerivedStateFiat()
  return (
    <Button
      size="xl"
      fullWidth
      testId="swap"
      disabled={!swapAmountString || swapAmountString === '0'}
      icon={!swapAmountString ? undefined : ExternalLinkIcon}
      iconPosition="end"
    >
      {!swapAmountString ? 'Enter Amount' : 'Confirm Purchase'}
    </Button>
  )
}
