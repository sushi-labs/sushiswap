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
  {
    label: '1 year',
    value: TimeUnit.Years,
  },
]

export const LimitExpiryInput = () => {
  return <TwapExpiryInput options={EXPIRATION_OPTIONS} />
}
