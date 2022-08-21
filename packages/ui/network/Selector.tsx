import { ChainId, chainName } from '@sushiswap/chain'
import { FC, useCallback } from 'react'

import { NetworkIcon } from '../icons'
import { classNames } from '../index'
import { Tooltip } from '../tooltip'

export interface SelectorProps {
  className?: string
  networks: ChainId[]
  selectedNetworks: ChainId[]
  onChange(selectedNetworks: ChainId[]): void
}

export const Selector: FC<SelectorProps> = ({ className, networks, selectedNetworks, onChange }) => {
  const handleClick = useCallback(
    (chainId: ChainId) => {
      if (networks.every((network) => selectedNetworks.includes(network))) {
        // If every network enabled, disable all but incoming chainId
        onChange([chainId])
      } else if (selectedNetworks.length === 1 && selectedNetworks[0] === chainId) {
        // If none selected, enable all
        onChange(networks)
      } else if (selectedNetworks.includes(chainId)) {
        onChange(selectedNetworks.filter((el) => el !== chainId))
      } else {
        onChange([...selectedNetworks, chainId])
      }
    },
    [networks, onChange, selectedNetworks]
  )

  return (
    <div className="flex gap-2">
      {networks.map((chainId) => (
        <Tooltip
          mouseEnterDelay={0.5}
          key={chainId}
          button={
            <div
              onClick={() => handleClick(chainId)}
              className={classNames(
                className,
                selectedNetworks.includes(chainId) ? 'bg-slate-700 border-transparent' : 'border-slate-800',
                'hover:ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-900 border-2 rounded-xl overflow-hidden cursor-pointer p-2'
              )}
            >
              <NetworkIcon
                type="circle"
                chainId={chainId}
                width={20}
                height={20}
                className={selectedNetworks.includes(chainId) ? '' : 'saturate-0'}
              />
            </div>
          }
          panel={<div>{chainName[chainId]}</div>}
        />
      ))}
    </div>
  )
}
