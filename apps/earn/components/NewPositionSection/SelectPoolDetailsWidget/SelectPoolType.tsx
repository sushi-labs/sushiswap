import { RadioGroup } from '@headlessui/react'
import { CheckIcon, PencilIcon, StarIcon } from '@heroicons/react/solid'
import { classNames } from '@sushiswap/ui'
import { PoolFinderType } from '@sushiswap/wagmi'
import React, { useCallback, useState } from 'react'

import { TRIDENT_ENABLED_NETWORKS } from '../../../config'
import { useAddPositionActions, useAddPositionState } from '../../AddPositionProvider'

const POOL_OPTIONS = [
  {
    value: PoolFinderType.ConcentratedLiquidity,
    title: 'Concentrated Liquidity',
    subtitle: 'Yields the highest returns',
  },
  {
    value: PoolFinderType.Stable,
    title: 'Stable',
    subtitle: 'Suitable for stable pairs',
  },
  {
    value: PoolFinderType.Classic,
    title: 'Classic',
    subtitle: 'Suitable for regular pairs',
  },
  {
    value: PoolFinderType.V2,
    title: 'Classic (Legacy)',
    subtitle: 'Suitable for regular pairs',
  },
]

export const SelectPoolType = () => {
  const [edit, setEdit] = useState(false)
  const { poolType, chainId } = useAddPositionState()
  const { setPoolType } = useAddPositionActions()

  const selected = POOL_OPTIONS.find((el) => el.value === poolType)
  const editable = TRIDENT_ENABLED_NETWORKS.includes(chainId)

  const onEdited = useCallback(() => {
    setEdit(false)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      {!edit ? (
        <div className="flex justify-between py-3">
          <p className="text-sm font-medium text-slate-300">Pool Type</p>
          <button
            className={classNames(
              editable ? 'cursor-pointer hover:text-slate-300' : 'cursor-default',
              'flex gap-1 items-center text-sm font-semibold text-slate-50'
            )}
            onClick={() => (editable ? setEdit(true) : undefined)}
          >
            {poolType === PoolFinderType.ConcentratedLiquidity && (
              <StarIcon width={12} height={12} className="text-yellow" />
            )}
            {selected?.title} {editable && <PencilIcon width={16} height={16} />}
          </button>
        </div>
      ) : (
        <RadioGroup value={poolType} onChange={setPoolType}>
          <p className="text-sm font-medium text-slate-300 py-3">Pool Type</p>
          <div className="grid grid-cols-2 gap-2 pb-3">
            {POOL_OPTIONS.filter((el) =>
              TRIDENT_ENABLED_NETWORKS.includes(chainId) ? true : el.value === PoolFinderType.Classic
            ).map(({ value, title, subtitle }) => (
              <RadioGroup.Option
                key={value}
                value={value}
                onClick={onEdited}
                className={({ checked }) =>
                  classNames(
                    'rounded-lg p-2 cursor-pointer border',
                    `${
                      checked
                        ? 'ring-1 ring-blue shadow-md shadow-blue/50 border-blue'
                        : 'ring-0 hover:ring-1 hover:ring-slate-200/10 border-slate-200/10'
                    }`
                  )
                }
              >
                {({ checked }) => (
                  <div className="relative">
                    {checked && (
                      <div className="absolute right-0 bg-blue rounded-full p-0.5">
                        <CheckIcon width={12} height={12} />
                      </div>
                    )}
                    <div className="flex flex-col items-start">
                      <p className="flex gap-0.5 items-center text-xs font-semibold text-slate-50">
                        {value === PoolFinderType.ConcentratedLiquidity && (
                          <StarIcon width={12} height={12} className="text-yellow" />
                        )}
                        {title}
                      </p>
                      <p className="text-[10px] font-medium text-slate-300">{subtitle}</p>
                    </div>
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  )
}
