import { RadioGroup } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import chains from '@sushiswap/chain'
import { classNames, IconButton, NetworkIcon } from '@sushiswap/ui'
import React, { FC, useState } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../../config'
import { useAddPositionActions, useAddPositionState } from '../../AddPositionProvider'

export const SelectNetwork: FC = () => {
  const [edit, setEdit] = useState(false)
  const { chainId } = useAddPositionState()
  const { setChainId } = useAddPositionActions()

  return (
    <div className="flex flex-col gap-3">
      {!edit ? (
        <div className="flex justify-between py-3">
          <p className="text-sm font-medium text-slate-300">Network</p>
          <button
            className="group hover:cursor-pointer flex gap-1.5 items-center text-sm font-semibold text-slate-50"
            onClick={() => setEdit(true)}
          >
            <NetworkIcon chainId={chainId} width={20} height={20} />
            <p className="text-sm font-semibold text-slate-50 group-hover:text-slate-300">{chains[chainId].name}</p>
            <ChevronDownIcon width={16} height={16} className="text-slate-50 group-hover:text-slate-300" />
          </button>
        </div>
      ) : (
        <RadioGroup value={chainId} onChange={setChainId}>
          <p className="text-sm font-medium text-slate-300 py-3">Network</p>
          <div className="flex flex-wrap gap-2 pb-3">
            {SUPPORTED_CHAIN_IDS.map((el) => (
              <RadioGroup.Option
                key={el}
                onClick={() => setEdit(false)}
                as={IconButton}
                description={chains[el].name}
                value={el}
                className={({ checked }) =>
                  classNames(
                    'rounded-full p-2 cursor-pointer',
                    `${
                      checked
                        ? 'ring-2 ring-blue bg-blue/20 shadow-md shadow-blue/50'
                        : 'ring-0 hover:ring-2 hover:ring-slate-200/20'
                    }`
                  )
                }
              >
                <NetworkIcon type="circle" chainId={el} width={22} height={22} />
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  )
}
