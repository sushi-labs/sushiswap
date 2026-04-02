import { RadioGroup } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { usePriceProtection } from '@sushiswap/hooks'
import classNames from 'classnames'
import React, { type FC, useCallback } from 'react'

import { Collapsible } from '../animation'
import { CardDescription, CardHeader, CardTitle } from '../card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardPrimitive,
  HoverCardTrigger,
} from '../hover-card'
import { Label } from '../label'
import { Separator } from '../separator'
import { Switch } from '../switch'
import { TextField } from '../text-field'
import { Toggle } from '../toggle'
import { typographyVariants } from '../typography'

const DEFAULT_PRICE_PROTECTION = '3'
const TABS = ['1', '3', '5']

export const PriceProtection: FC<{
  className?: string
  title?: string
  showAutoSelector?: boolean
}> = ({ className, title = 'Price Protection', showAutoSelector = true }) => {
  const [priceProtection, setPriceProtection] = usePriceProtection()

  const onChange = useCallback(
    (value: string) => {
      const numValue = Number(value)
      if (!Number.isNaN(numValue) && numValue > 50) {
        setPriceProtection('50')
        return
      }
      if (!Number.isNaN(numValue) && numValue < 0) {
        setPriceProtection('0')
        return
      }
      setPriceProtection(value)
    },
    [setPriceProtection],
  )

  const isAuto = priceProtection === 'AUTO'

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <div className={classNames(className, 'p-4 rounded-lg')}>
        {showAutoSelector ? (
          <>
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-col gap-2">
                <Label>Automatic Price Protection</Label>
                <span
                  className={typographyVariants({
                    variant: 'muted',
                    className: 'text-sm',
                  })}
                >
                  Turn off automatic price protection <br /> to adjust the
                  value.
                </span>
              </div>
              <Switch
                checked={isAuto}
                onCheckedChange={(checked) =>
                  setPriceProtection(
                    checked ? 'AUTO' : DEFAULT_PRICE_PROTECTION,
                  )
                }
              />
            </div>
            <div className="my-4 h-px w-full dark:bg-slate-200/5 bg-gray-900/5" />
          </>
        ) : null}
        <div className="flex justify-between gap-[60px] mb-3">
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1">
              {title}{' '}
              <HoverCardTrigger>
                <InformationCircleIcon width={16} height={16} />
              </HoverCardTrigger>
              <HoverCardPrimitive.Portal>
                <HoverCardContent className="!p-0 max-w-[320px] z-[1080]">
                  <CardHeader>
                    <CardTitle>Price Protection</CardTitle>
                    <CardDescription className="prose">
                      <p>
                        The protocol uses an oracle price to help protect users
                        from unfavorable executions. If the execution price is
                        worse than the oracle price by more than the allowed
                        percentage, the transaction will not be executed.
                      </p>
                    </CardDescription>
                  </CardHeader>
                </HoverCardContent>
              </HoverCardPrimitive.Portal>
            </Label>
          </div>
          <span className="text-sm font-semibold dark:text-slate-400 text-gray-600">
            {isAuto ? `${DEFAULT_PRICE_PROTECTION}%` : `${priceProtection}%`}
          </span>
        </div>
        <Collapsible open={!isAuto}>
          <div className="flex gap-1 items-center border border-accent rounded-xl bg-secondary p-0.5">
            <RadioGroup value={priceProtection} onChange={onChange}>
              <div className="flex gap-1 items-center">
                {TABS.map((tab) => (
                  <RadioGroup.Option
                    className="h-[40px]"
                    key={tab}
                    value={tab}
                    as={Toggle}
                    size="sm"
                    pressed={priceProtection === tab}
                  >
                    {tab}%
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>

            <Separator orientation="vertical" className="min-h-[36px]" />
            <TextField
              type="number"
              value={priceProtection}
              onValueChange={onChange}
              placeholder="Custom"
              id="price-protection"
              maxDecimals={2}
              unit="%"
            />
          </div>
        </Collapsible>
      </div>
    </HoverCard>
  )
}

export const DEFAULT_PRICE_PROTECTION_VALUE = DEFAULT_PRICE_PROTECTION
