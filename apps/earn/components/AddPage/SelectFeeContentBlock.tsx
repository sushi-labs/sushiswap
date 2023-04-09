import { RadioGroup } from '@headlessui/react'
import { Fee } from '@sushiswap/amm'
import { classNames } from '@sushiswap/ui'
import { ContentBlock } from './ContentBlock'
import React from 'react'
import { useAddPositionActions, useAddPositionState } from './AddPositionProvider'

export const SelectFeeContentBlock = () => {
  const { fee } = useAddPositionState()
  const { setFee } = useAddPositionActions()

  return (
    <ContentBlock
      title={
        <>
          What percentage for <span className="text-gray-900 dark:text-white">fees</span> do you prefer?
        </>
      }
    >
      <div className="flex gap-4">
        <RadioGroup value={fee} onChange={setFee} className="flex flex-col gap-4">
          <RadioGroup.Option
            value={Fee.LOW}
            className={({ checked }) =>
              classNames(
                checked ? 'ring ring-blue' : '',
                'px-6 h-14 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer'
              )
            }
          >
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-slate-50 font-medium flex gap-4">
                {Fee.LOW / 100}% Fees.{' '}
                <span className="text-gray-500 dark:text-slate-400 text-slate-600">Best for very stable pairs.</span>
              </span>
            </div>
          </RadioGroup.Option>
          <RadioGroup.Option
            value={Fee.MEDIUM}
            className={({ checked }) =>
              classNames(
                checked ? 'ring ring-blue' : '',
                'px-6 h-14 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer'
              )
            }
          >
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-slate-50 font-medium flex gap-4">
                {Fee.MEDIUM / 100}% Fees.{' '}
                <span className="text-gray-500 dark:text-slate-400 text-slate-600"> Best for less volatile pairs.</span>
              </span>
            </div>
          </RadioGroup.Option>{' '}
          <RadioGroup.Option
            value={Fee.DEFAULT}
            className={({ checked }) =>
              classNames(
                checked ? 'ring ring-blue' : '',
                'px-6 h-14 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer'
              )
            }
          >
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-slate-50 font-medium flex gap-4">
                {Fee.DEFAULT / 100}0% Fees.{' '}
                <span className="text-gray-500 dark:text-slate-400 text-slate-600">Best for most pairs.</span>
              </span>
            </div>
          </RadioGroup.Option>{' '}
          <RadioGroup.Option
            value={Fee.HIGH}
            className={({ checked }) =>
              classNames(
                checked ? 'ring ring-blue' : '',
                'px-6 h-14 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer'
              )
            }
          >
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-slate-50 font-medium flex gap-4">
                {Fee.HIGH / 100}.00% Fees.{' '}
                <span className="text-gray-500 dark:text-slate-400 text-slate-600">Best for volatile pairs.</span>
              </span>
            </div>
          </RadioGroup.Option>
        </RadioGroup>
      </div>
    </ContentBlock>
  )
}
