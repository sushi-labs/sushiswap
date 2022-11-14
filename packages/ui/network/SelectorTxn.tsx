import { ChainId, chainName } from '@sushiswap/chain'
import { FC, ReactElement, useCallback, useMemo } from 'react'

import { NetworkIcon } from '../icons'
import { classNames } from '../index'
import { Tooltip } from '../tooltip'

export interface SelectorTxnProps {
  className?: string
  networks: ChainId[]
  selectedNetwork: ChainId
  onChange(selectedNetwork: ChainId | null): void
  exclusive?: boolean
  renderer?: (node: JSX.Element) => ReactElement
}

export const SelectorTxn: FC<SelectorTxnProps> = ({
  className,
  networks: _networks,
  selectedNetwork,
  onChange,
  exclusive,
  renderer = false,
}) => {
  const networks = useMemo(() => Array.from(new Set(_networks)), [_networks])
  const handleClick = useCallback(
    (chainId: ChainId) => {
      if (exclusive) {
        return onChange(chainId)
      }

      if (selectedNetwork === chainId) {
        // If none selected, enable all
        onChange(null)
      } else {
        onChange(chainId)
      }
    },
    [exclusive, networks, onChange, selectedNetwork]
  )

  return (
    <div className="flex flex-wrap gap-2">
      {networks.map((chainId) => {
        const button = (
          <div
            onClick={() => handleClick(chainId)}
            className={classNames(
              className,
              selectedNetwork === chainId ? 'bg-slate-700 border-transparent' : 'border-slate-800',
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
