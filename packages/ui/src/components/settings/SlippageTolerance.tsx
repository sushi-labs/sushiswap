import { RadioGroup } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useSlippageTolerance } from '@sushiswap/hooks'
import classNames from 'classnames'
import React, { FC, useCallback } from 'react'

import { Collapsible } from '../animation/Collapsible'
import { Explainer } from '../explainer'
import { Label } from '../label'
import { Separator } from '../separator'
import { Switch } from '../switch'
import { TextField } from '../text-field'
import { Toggle } from '../toggle'
import { typographyVariants } from '../typography'

const TABS = ['0.1', '0.5', '1.0']

export const SlippageTolerance: FC<{
  options?: {
    storageKey?: string
    defaultValue?: string
    title?: string
  }
}> = ({ options }) => {
  const [slippageTolerance, setSlippageTolerance] = useSlippageTolerance(options?.storageKey)
  const onChange = useCallback(
    (value: string) => {
      setSlippageTolerance(value)
    },
    [setSlippageTolerance]
  )

  const isDangerous =
    (!isNaN(+slippageTolerance) && +slippageTolerance >= 1.3) ||
    (!isNaN(+slippageTolerance) && +slippageTolerance <= 0.1 && +slippageTolerance > 0)

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label>Automatic Slippage Tolerance</Label>
          <span className={typographyVariants({ variant: 'muted', className: 'text-sm' })}>
            Turn off automatic slippage tolerance <br /> to adjust the value.
          </span>
        </div>
        <Switch
          checked={slippageTolerance === 'AUTO'}
          onCheckedChange={(checked) => setSlippageTolerance(checked ? 'AUTO' : '0.5')}
        />
      </div>
      <div className="my-4 h-px w-full dark:bg-slate-200/5 bg-gray-900/5" />
      <div className="flex justify-between gap-[60px]">
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-1">
            {options?.title || 'Slippage'}{' '}
            <Explainer>
              <span className="text-gray-900 dark:text-slate-50 font-semibold">Slippage</span>
              <span className="text-gray-500 dark:text-slate-400 font-medium">
                {' '}
                Slippage is the difference between the expected value of output from a trade and the actual value due to
                asset volatility and liquidity depth. If the actual slippage falls outside of the user-designated range,
                the transaction will revert.{' '}
              </span>
              <a
                target="_blank"
                className="text-blue dark:text-blue dark:font-semibold flex gap-1 items-center font-medium"
                href="https://www.sushi.com/academy/articles/what-is-slippage-price-impact"
                rel="noreferrer"
              >
                Learn more <ChevronRightIcon width={12} height={12} />
              </a>
            </Explainer>
          </Label>
          <span className="text-sm text-red">
            {+slippageTolerance <= 0.1 && +slippageTolerance > 0
              ? 'Your transaction may be reverted due to low slippage tolerance'
              : isDangerous
              ? 'Your transaction may be frontrun due to high slippage tolerance'
              : undefined}
          </span>
        </div>
        <span
          className={classNames(
            isDangerous ? '!text-red' : 'dark:text-slate-400 text-gray-600',
            'text-sm font-semibold'
          )}
        >
          {slippageTolerance === 'AUTO' ? '0.5%' : `${slippageTolerance}%`}
        </span>
      </div>
      <Collapsible open={slippageTolerance !== 'AUTO'}>
        <div className="flex gap-1 items-center p-1 pt-5">
          <RadioGroup value={slippageTolerance} onChange={onChange}>
            <div className="flex gap-1 items-center">
              {TABS.map((tab, i) => (
                <RadioGroup.Option key={i} value={tab} as={Toggle} size="sm" pressed={slippageTolerance === tab}>
                  {tab}%
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>

          <Separator orientation="vertical" className="h-[40px]" />
          <TextField
            type="number"
            value={slippageTolerance}
            onValueChange={setSlippageTolerance}
            placeholder="Custom"
            id="slippage-tolerance"
            maxDecimals={1}
            className="!w-[80px]"
            unit="%"
          />
        </div>
      </Collapsible>
    </div>
  )
}
