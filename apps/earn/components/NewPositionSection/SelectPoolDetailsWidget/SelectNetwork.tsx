import { RadioGroup } from '@headlessui/react'
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
      <span className="text-[10px] uppercase font-bold text-slate-400">Network</span>
      {!edit ? (
        <div className="border border-slate-200/10 rounded-xl flex gap-2 items-center p-4">
          <NetworkIcon chainId={chainId} width={36} height={36} />
          <div className="flex flex-col flex-grow items-start">
            <p className="flex gap-1 items-center text-sm font-semibold text-slate-50">{chains[chainId].name}</p>
            <a className="text-[10px] font-medium text-blue" href={chains[chainId].explorers?.[0].url}>
              {chains[chainId].explorers?.[0].url}
            </a>
          </div>
          <button
            className="py-1.5 px-3 font-semibold bg-slate-700 hover:bg-slate-600 rounded-xl text-xs"
            onClick={() => setEdit(true)}
          >
            Edit
          </button>
        </div>
      ) : (
        <RadioGroup value={chainId} onChange={setChainId} className="flex flex-col gap-3">
          <div className="flex justify-between items-center gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Network</span>
            <span className="text-[10px] uppercase font-bold text-white">{chains[chainId].name}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_CHAIN_IDS.map((el) => (
              <RadioGroup.Option
                key={el}
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
