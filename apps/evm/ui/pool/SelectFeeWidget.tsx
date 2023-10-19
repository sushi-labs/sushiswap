'use client'

import { RadioGroup } from '@headlessui/react'
import { FormSection, classNames } from '@sushiswap/ui'
import React, { FC, memo } from 'react'
import { Fee } from 'sushi/dex'

interface SelectFeeWidgetProps {
  fee: number
  setFee(fee: number): void
}

export const FEE_OPTIONS = [
  {
    value: Fee.LOW,
    subtitle: 'Best for very stable pairs.',
  },
  {
    value: Fee.MEDIUM,
    subtitle: 'Best for less volatile pairs.',
  },
  {
    value: Fee.DEFAULT,
    subtitle: 'Best for most pairs.',
  },
  {
    value: Fee.HIGH,
    subtitle: 'Best for volatile pairs.',
  },
]

export const SelectFeeWidget: FC<SelectFeeWidgetProps> = memo(
  function SelectFeeWidget({ fee, setFee }) {
    return (
      <FormSection
        title="Fee tier"
        description="Some fee tiers work better than others depending on the volatility of your pair. Lower fee tiers generally work better when pairing stable coins. Higher fee tiers generally work better when pairing exotic coins."
      >
        <RadioGroup
          value={fee}
          onChange={setFee}
          className="grid grid-cols-2 gap-4"
        >
          {FEE_OPTIONS.map((option) => (
            <RadioGroup.Option
              testdata-id={`fee-option-${option.value}`}
              key={option.value}
              value={option.value}
              className={({ checked }) =>
                classNames(
                  checked ? 'ring ring-blue' : '',
                  'px-5 py-4 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer',
                )
              }
            >
              <div className="flex flex-col">
                <span className="flex gap-4 font-medium text-gray-900 dark:text-slate-50">
                  {option.value / 100}% Fees{' '}
                </span>
                <span className="text-sm text-gray-500 dark:text-slate-400 text-slate-600">
                  {option.subtitle}
                </span>
              </div>
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </FormSection>
    )
  },
)
