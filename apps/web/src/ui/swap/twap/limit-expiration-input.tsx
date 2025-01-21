'use client'

import { Radio, RadioGroup } from '@headlessui/react'
import { Toggle } from '@sushiswap/ui'
import { TwapDuration } from 'src/lib/swap/twap/types'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

const EXPIRATION_OPTIONS = [
  {
    label: '1 day',
    value: TwapDuration.Day,
  },
  {
    label: '1 week',
    value: TwapDuration.Week,
  },
  {
    label: '1 month',
    value: TwapDuration.Month,
  },
  {
    label: '1 year',
    value: TwapDuration.Year,
  },
]

export const LimitExpirationInput = () => {
  const {
    state: { expiry },
    mutate: { setExpiry },
  } = useDerivedStateTwap()

  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground font-medium">Expires in</span>
      <RadioGroup value={expiry} className="gap-2 flex flex-wrap py-1">
        {EXPIRATION_OPTIONS.map((option) => (
          <Radio value={option.value} key={option.value.unit}>
            <Toggle
              //   disabled={isLoading}
              variant="outline"
              className="whitespace-nowrap !rounded-[50px] !px-4 !h-7"
              onClick={() => setExpiry(option.value)}
              pressed={expiry.unit === option.value.unit}
            >
              {option.label}
            </Toggle>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  )
}
