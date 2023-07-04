import { RadioGroup } from '@headlessui/react'
import { Fee } from '@sushiswap/amm'
import { classNames } from '@sushiswap/ui'
import React, { FC, memo } from 'react'

import { ContentBlock } from '../AddPage/ContentBlock'

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

export const SelectFeeWidget: FC<SelectFeeWidgetProps> = memo(function SelectFeeWidget({ fee, setFee }) {
  return (
    <ContentBlock
      title={
        <>
          Which <span className="text-gray-900 dark:text-white">fee tier</span> do you prefer?
        </>
      }
    >
      <RadioGroup value={fee} onChange={setFee} className="grid grid-cols-2 gap-4">
        {FEE_OPTIONS.map((option) => (
          <RadioGroup.Option
            testdata-id={`fee-option-${option.value}`}
            key={option.value}
            value={option.value}
            className={({ checked }) =>
              classNames(
                checked ? 'ring ring-blue' : '',
                'px-5 py-4 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer'
              )
            }
          >
            <div className="flex flex-col">
              <span className="flex gap-4 font-medium text-gray-900 dark:text-slate-50">
                {option.value / 100}% Fees{' '}
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-400 text-slate-600">{option.subtitle}</span>
            </div>
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </ContentBlock>
  )
})
