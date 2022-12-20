import { RadioGroup } from '@headlessui/react'
import chains, { ChainId } from '@sushiswap/chain'
import { classNames, IconButton, NetworkIcon } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import React, { FC, memo } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'

interface SelectNetworkWidgetProps {
  chainId: ChainId
  onSelect(chainId: ChainId): void
}

export const SelectNetworkWidget: FC<SelectNetworkWidgetProps> = memo(({ chainId, onSelect }) => {
  return (
    <Widget id="selectNetwork" maxWidth={400} className="!bg-slate-800">
      <Widget.Content>
        <Widget.Header title="1. Network" className="!pb-3" />

        <div className="p-3 space-y-3">
          <p className="text-xs text-slate-300">
            Selected: <br />
            <span className="font-semibold text-xs text-slate-100">{chains[chainId].name}</span>
          </p>
          <RadioGroup value={chainId} onChange={onSelect} className="flex flex-wrap gap-2">
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
          </RadioGroup>
        </div>
      </Widget.Content>
    </Widget>
  )
})
