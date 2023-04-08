import { ContentBlock } from './ContentBlock'
import { RadioGroup } from '@headlessui/react'
import { classNames } from '@sushiswap/ui'
import React from 'react'
import { useAddPositionActions, useAddPositionState } from './AddPositionProvider'
import { PoolType } from '@sushiswap/wagmi/future/hooks'

export const SelectPoolTypeContentBlock = () => {
  const { poolType } = useAddPositionState()
  const { setPoolType } = useAddPositionActions()

  return (
    <ContentBlock
      title={
        <>
          Select your preferred <span className="text-gray-900 dark:text-white">pool type</span>.
        </>
      }
    >
      <div className="flex gap-4">
        <RadioGroup value={poolType} onChange={setPoolType} className="flex flex-col gap-4">
          <RadioGroup.Option
            value={PoolType.ConstantProduct}
            className={({ checked }) =>
              classNames(
                checked ? 'ring ring-blue' : '',
                'px-6 h-14 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer'
              )
            }
          >
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-slate-50 font-medium flex gap-4">
                Classic Pool.{' '}
                <span className="text-gray-500 dark:text-slate-400 text-slate-600">Suited for most pairs.</span>
              </span>
            </div>
          </RadioGroup.Option>
          <RadioGroup.Option
            value={PoolType.StablePool}
            className={({ checked }) =>
              classNames(
                checked ? 'ring ring-blue' : '',
                'px-6 h-14 flex items-center rounded-xl bg-white dark:bg-slate-800/40 cursor-pointer'
              )
            }
          >
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-slate-50 font-medium flex gap-4">
                Stable Pool.{' '}
                <span className="text-gray-500 dark:text-slate-400 text-slate-600">Best suited for stable pairs.</span>
              </span>
            </div>
          </RadioGroup.Option>
        </RadioGroup>
      </div>
    </ContentBlock>
  )
}
