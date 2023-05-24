import { RadioGroup } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import React, { Dispatch, FC, memo, SetStateAction } from 'react'

import { ContentBlock } from '../AddPage/ContentBlock'
import { FeeAmount } from '@sushiswap/v3-sdk'
import { useConcentratedLiquidityURLState } from '../ConcentratedLiquidityURLStateProvider'
import { Type } from '@sushiswap/currency'

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

interface SelectFeeConcentratedWidget {
  feeAmount: FeeAmount | undefined
  setFeeAmount: (fee: FeeAmount) => void
  token0: Type | undefined
  token1: Type | undefined
}

export const SelectFeeConcentratedWidget: FC<SelectFeeConcentratedWidget> = memo(function SelectFeeWidget({
  feeAmount,
  setFeeAmount,
  token0,
  token1,
}) {
  return (
    <ContentBlock
      disabled={!token0 || !token1}
      title={
        <>
          What percentage for <span className="text-gray-900 dark:text-white">fees</span> do you prefer?
        </>
      }
    >
      <RadioGroup
        value={feeAmount}
        onChange={setFeeAmount}
        className="grid grid-cols-2 gap-4"
        disabled={!token0 || !token1}
      >
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
                {option.value / 10000}% Fees{' '}
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-400 text-slate-600">{option.subtitle}</span>
            </div>
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </ContentBlock>
  )
})
