'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/outline'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  classNames,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { TwapExpiryTimeDurations } from 'src/lib/swap/twap'
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

export const LimitExpiryInputV2 = () => {
  const {
    state: { expiry },
    mutate: { setExpiry },
  } = useDerivedStateTwap()

  const label = useMemo(() => {
    return EXPIRATION_OPTIONS.find(
      (option) => option.value.unit === expiry?.unit,
    )?.label
  }, [expiry])

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-slate-900 font-medium dark:text-pink-100 whitespace-nowrap">
        Expires in
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            size="xs"
            icon={ChevronDownIcon}
            iconPosition="end"
            className={classNames(
              '!text-xs !font-medium !rounded-xl !gap-1 text-slate-900 dark:text-slate-50 !bg-[#0000001F] dark:!bg-[#FFFFFF1F]',
            )}
          >
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-h-[195px] overflow-y-auto hide-scrollbar !bg-slate-50 dark:!bg-slate-900 !backdrop-blur-none"
        >
          <DropdownMenuGroup>
            {EXPIRATION_OPTIONS.map((option, idx) => (
              <DropdownMenuItem
                className="pr-10"
                key={idx}
                onClick={() => setExpiry(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
