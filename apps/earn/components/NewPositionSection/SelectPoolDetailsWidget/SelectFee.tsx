import { RadioGroup } from '@headlessui/react'
import { CheckIcon, PencilIcon } from '@heroicons/react/solid'
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
  const { fee, chainId } = useAddPositionState()
  const { setFee } = useAddPositionActions()
  const selected = FEE_OPTIONS.find((el) => el.value === fee)

  const onEdited = useCallback(() => {
    setEdit(false)
  }, [])

  const editable = TRIDENT_ENABLED_NETWORKS.includes(chainId)

  return (
    <div className="flex flex-col gap-3">
      {!edit ? (
        <div className="flex justify-between py-3">
          <p className="text-sm font-medium text-slate-300">Fee</p>
          <button
            className={classNames(
              editable ? 'cursor-pointer hover:text-slate-300' : 'cursor-default',
              'flex gap-1 items-center text-sm font-semibold text-slate-50'
            )}
            onClick={() => (editable ? setEdit(true) : undefined)}
          >
            {selected?.title} {editable && <PencilIcon width={16} height={16} />}
          </button>
        </div>
      ) : (
        <RadioGroup value={fee} onChange={setFee}>
          <p className="text-sm font-medium text-slate-300 py-3">Fee</p>
          <div className="grid grid-cols-2 gap-2 pb-3">
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
