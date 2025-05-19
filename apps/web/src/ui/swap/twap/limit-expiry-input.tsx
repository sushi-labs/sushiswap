'use client'

import { Radio, RadioGroup } from '@headlessui/react'
import { Toggle } from '@sushiswap/ui'
import { TwapExpiryTimeDurations } from 'src/lib/swap/twap/types'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

const EXPIRATION_OPTIONS = [
  {
    label: '1 day',
    value: TwapExpiryTimeDurations.Day,
  },
  {
    label: '1 week',
    value: TwapExpiryTimeDurations.Week,
  },
  {
    label: '1 month',
    value: TwapExpiryTimeDurations.Month,
  },
  {
    label: '1 year',
    value: TwapExpiryTimeDurations.Year,
  },
]

export const LimitExpiryInput = () => {
  const {
    state: { expiry },
    mutate: { setExpiry },
  } = useDerivedStateTwap()

  return (
    <div className="flex flex-wrap justify-between items-center pb-2">
      <span className="text-muted-foreground font-medium whitespace-nowrap">
        Expires in
      </span>
      <RadioGroup value={expiry} className="gap-2 flex py-1">
        {EXPIRATION_OPTIONS.map((option) => (
          <Radio value={option.value} key={option.value.unit}>
            <Toggle
              variant="outline"
              className="whitespace-nowrap !rounded-[50px] !px-4 !h-7"
              onClick={() => setExpiry(option.value)}
              pressed={expiry?.unit === option.value.unit}
            >
              {option.label}
            </Toggle>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  )
}
