import { RadioGroup } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import React, { FC, memo } from 'react'

import { ContentBlock } from '../AddPage/ContentBlock'
import { FeeAmount } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityURLState } from '../ConcentratedLiquidityURLStateProvider'

export const FEE_OPTIONS = [
  {
    value: FeeAmount.LOWEST,
    subtitle: 'Best for very stable pairs.',
  },
  {
    value: FeeAmount.LOW,
    subtitle: 'Best for less volatile pairs.',
  },
  {
    value: FeeAmount.MEDIUM,
    subtitle: 'Best for most pairs.',
  },
  {
    value: FeeAmount.HIGH,
    subtitle: 'Best for volatile pairs.',
  },
]

export const SelectFeeConcentratedWidget: FC = memo(function SelectFeeWidget({}) {
  const { feeAmount, setFeeAmount, token0, token1 } = useConcentratedLiquidityURLState()

  return (
    <ContentBlock
      disabled={!token0 || !token1}
      title={
        <>
          What percentage for <span className="text-gray-900 dark:text-white">fees</span> do you prefer?
        </>
      }
    >
      <RadioGroup value={feeAmount} onChange={setFeeAmount} className="grid grid-cols-2 gap-4">
        {FEE_OPTIONS.map((option) => (
          <RadioGroup.Option
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
              <span className="text-gray-900 dark:text-slate-50 font-medium flex gap-4">
                {option.value / 10000}% Fees{' '}
              </span>
              <span className="text-gray-500 dark:text-slate-400 text-slate-600 text-sm">{option.subtitle}</span>
            </div>
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </ContentBlock>
  )
})
