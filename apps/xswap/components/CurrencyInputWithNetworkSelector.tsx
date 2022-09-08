import { ChevronDownIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { classNames, NetworkIcon } from '@sushiswap/ui'
import { Web3Input } from '@sushiswap/wagmi'
import { CurrencyInputProps } from '@sushiswap/wagmi/components/Web3Input/Currency'
import { FC, useCallback, useState } from 'react'

import { NetworkSelectorOverlay } from './NetworkSelectorOverlay'

interface CurrencyInputWithNetworkSelectorProps extends CurrencyInputProps {
  onNetworkSelect(chainId: ChainId): void
  className?: string
}

export const CurrencyInputWithNetworkSelector: FC<CurrencyInputWithNetworkSelectorProps> = ({
  onNetworkSelect,
  className,
  ...props
}) => {
  const [networkSelectorOpen, setNetworkSelectorOpen] = useState(false)

  const handleClose = useCallback(() => {
    setNetworkSelectorOpen(false)
  }, [])

  return (
    <div className={classNames('flex flex-col p-3', className)}>
      <div className="flex flex-row justify-between">
        <button
          type="button"
          className="text-slate-400 hover:text-slate-300 relative flex items-center gap-1 py-1 text-xs font-medium"
          onClick={(e) => {
            setNetworkSelectorOpen(true)
            e.stopPropagation()
          }}
        >
          <NetworkIcon chainId={props.chainId} width="16px" height="16px" className="mr-1" />
          {chains[props.chainId].name} <ChevronDownIcon width={16} height={16} />
        </button>
      </div>
      <Web3Input.Currency {...props} />
      <NetworkSelectorOverlay
        open={networkSelectorOpen}
        onClose={handleClose}
        onSelect={onNetworkSelect}
        selected={props.chainId}
      />
    </div>
  )
}
