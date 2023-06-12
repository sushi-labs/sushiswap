import { RadioGroup } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react'
import { Explainer } from '../Explainer'
import Switch from '../Switch'
import classNames from 'classnames'
import { Collapsible } from '../animation/Collapsible'
import { Input } from '../input'
import { useSlippageTolerance } from '@sushiswap/hooks'

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
      setCustomVal('')
      setSlippageTolerance(value)
    },
    [setSlippageTolerance]
  )

  const [customVal, setCustomVal] = useState('')

  const isDangerous =
    (!isNaN(+slippageTolerance) && +slippageTolerance >= 1.3) ||
    (!isNaN(+slippageTolerance) && +slippageTolerance <= 0.1 && +slippageTolerance > 0)

  useEffect(() => {
    if (!TABS.includes(slippageTolerance) && slippageTolerance !== 'AUTO') setCustomVal(slippageTolerance)
  }, [slippageTolerance])

  return (
    <div className="p-4 rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-slate-50">Automatic Slippage Tolerance</h1>
          <span className="text-sm text-gray-600 dark:text-slate-500">
            Turn off automatic slippage tolerance <br /> to adjust the value.
          </span>
        </div>
        <Switch
          checked={slippageTolerance === 'AUTO'}
          onChange={(checked) => setSlippageTolerance(checked ? 'AUTO' : '0.5')}
        />
      </div>
      <div className="my-4 h-px w-full dark:bg-slate-200/5 bg-gray-900/5" />
      <div className="flex justify-between gap-[60px]">
        <div className="flex flex-col gap-2">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-slate-50 flex gap-1">
            {options?.title || 'Slippage'}{' '}
            <Explainer iconSize={16} placement="right">
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
          </h1>
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
        <div className="p-1 pt-5">
          <RadioGroup value={slippageTolerance} onChange={onChange}>
            <div className="items-center relative bg-gray-200 dark:bg-slate-800 dark:border-slate-800 paper border-4 border-gray-200 rounded-lg overflow-hidden flex gap-1">
              <>
                {TABS.map((tab, i) => (
                  <RadioGroup.Option as={Fragment} key={i} value={tab}>
                    {({ checked }) => (
                      <button
                        className={classNames(
                          checked
                            ? 'text-gray-900 dark:text-slate-50 bg-white dark:bg-slate-700'
                            : 'text-gray-500 dark:text-slate-500 hover:bg-gray-100 hover:dark:bg-white/[0.04]',
                          'z-[1] relative rounded-lg text-sm h-8 font-medium flex flex-grow items-center justify-center'
                        )}
                      >
                        {tab}%
                      </button>
                    )}
                  </RadioGroup.Option>
                ))}

                <div className="h-[28px] w-0.5 bg-gray-900/5 dark:bg-slate-200/5" />
                <Input.Numeric
                  maxDecimals={1}
                  variant="unstyled"
                  value={customVal}
                  onUserInput={setSlippageTolerance}
                  placeholder="Custom"
                  className={classNames(
                    'border-0 focus:bg-white focus:dark:bg-slate-800 focus:outline-none focus:!ring-0 focus:!border-2 border-blue !text-gray-900 dark:!text-slate-50 z-[1] relative rounded-lg text-sm h-8 font-medium bg-transparent text-center w-[100px]'
                  )}
                />
              </>
            </div>
          </RadioGroup>
        </div>
      </Collapsible>
    </div>
  )
}
