import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/solid'
import { Fee } from '@sushiswap/amm'
import { classNames } from '@sushiswap/ui'
import React, { FC, useCallback, useState } from 'react'

import { TRIDENT_ENABLED_NETWORKS } from '../../../config'
import { useAddPositionActions, useAddPositionState } from '../../AddPositionProvider'

const FEE_OPTIONS = [
  { value: Fee.LOW, title: '0.01%', subtitle: 'Best for stable pairs' },
  { value: Fee.MEDIUM, title: '0.05%', subtitle: 'Best for less volatile pairs' },
  { value: Fee.DEFAULT, title: '0.3%', subtitle: 'Best for most pairs' },
  { value: Fee.HIGH, title: '1.0%', subtitle: 'Best for volatile pairs' },
]

export const SelectFee: FC = () => {
  const [edit, setEdit] = useState(false)
  const { fee, token0, token1, chainId } = useAddPositionState()
  const { setFee } = useAddPositionActions()
  const selected = FEE_OPTIONS.find((el) => el.value === fee)

  const onEdited = useCallback(() => {
    setEdit(false)
  }, [])

  return (
    <div className={classNames(token0 && token1 ? '' : 'opacity-20 pointer-events-none', 'flex flex-col gap-3')}>
      <span className="text-[10px] uppercase font-bold text-slate-400">Fee</span>
      {!edit ? (
        <div className="group border border-slate-200/10 rounded-xl flex items-center p-4">
          <div className="flex flex-col gap-1 flex-grow items-start">
            <p className="flex gap-0.5 items-center text-sm font-semibold text-slate-50">{selected?.title}</p>
            <p className="text-xs font-medium text-slate-300">{selected?.subtitle}</p>
          </div>
          <button
            className="py-1.5 px-3 font-semibold bg-slate-700 hover:bg-slate-600 rounded-xl text-xs"
            onClick={() => setEdit(true)}
          >
            Edit
          </button>
        </div>
      ) : (
        <RadioGroup value={fee} onChange={setFee}>
          <div className="grid grid-cols-2 gap-2">
            {FEE_OPTIONS.filter((el) =>
              TRIDENT_ENABLED_NETWORKS.includes(chainId) ? true : el.value === Fee.DEFAULT
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
                      <p className="text-xs font-semibold text-slate-50">{title}</p>
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
