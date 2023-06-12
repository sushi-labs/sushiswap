import { ChainId, chainName } from '@sushiswap/chain'
import { FC, ReactElement, useCallback, useMemo } from 'react'

import { NetworkIcon } from '../icons'
import { classNames } from '../index'
import { Tooltip } from '../tooltip'

export interface SelectorProps {
  className?: string
  networks: ChainId[]
  selectedNetworks: ChainId[]
  onChange(selectedNetworks: ChainId[]): void
  exclusive?: boolean
  renderer?: (node: JSX.Element) => ReactElement
}

export const Selector: FC<SelectorProps> = ({
  className,
  networks: _networks,
  selectedNetworks,
  onChange,
  exclusive,
  renderer = false,
}) => {
  const networks = useMemo(() => Array.from(new Set(_networks)), [_networks])
  const handleClick = useCallback(
    (chainId: ChainId) => {
      if (exclusive) {
        return onChange([chainId])
      }

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
    [exclusive, networks, onChange, selectedNetworks]
  )

  return (
    <div className="flex flex-wrap gap-2">
      {networks.map((chainId) => {
        const button = (
          <div
            onClick={() => handleClick(chainId)}
            className={classNames(
              className,
              selectedNetworks.includes(chainId) ? 'bg-slate-700 border-transparent' : 'border-slate-800',
              'hover:ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-900 border-2 rounded-xl overflow-hidden cursor-pointer p-2'
            )}
          >
            <NetworkIcon type="circle" chainId={chainId} width={20} height={20} />
          </div>
        )

        return (
          <Tooltip
            mouseEnterDelay={0.5}
            key={chainId}
            button={typeof renderer === 'function' ? renderer(button) : button}
            panel={<div>{chainName[chainId]}</div>}
          />
        )
      })}
    </div>
  )
}
