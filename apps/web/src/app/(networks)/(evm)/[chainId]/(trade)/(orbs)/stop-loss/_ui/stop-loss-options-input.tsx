import { TimeUnit } from '@orbs-network/spot-react'
import { TwapExpiryInput } from '../../_ui/twap-options-input'

const EXPIRATION_OPTIONS = [
  {
    label: '1 day',
    value: TimeUnit.Days,
  },
  {
    label: '1 week',
    value: TimeUnit.Weeks,
  },
  {
    label: '1 month',
    value: TimeUnit.Months,
  },
]

export const StopLossExpiryInput = () => {
  return <TwapExpiryInput options={EXPIRATION_OPTIONS} />
}
