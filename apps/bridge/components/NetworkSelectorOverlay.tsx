import { CheckIcon } from '@heroicons/react/outline'
import chains, { ChainId } from '@sushiswap/chain'
import { classNames, Dialog, NetworkIcon, Typography } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC, useCallback } from 'react'

interface NetworkSelectorOverlay {
  open: boolean
  onClose(): void
  onSelect(network: ChainId): void
  selected: ChainId
  className?: string
  networks?: ChainId[]
}

export const NetworkSelectorOverlay: FC<NetworkSelectorOverlay> = ({
  networks = SUPPORTED_CHAIN_IDS,
  open,
  onClose,
  onSelect,
  selected,
}) => {
  const handleSelect = useCallback(
    (chainId: ChainId) => {
      onSelect(chainId)
      onClose()
    },
    [onClose, onSelect]
  )

  return (
    <Dialog open={open} onClose={onClose}>
      <Dialog.Content className="bg-slate-800 !pb-0 !px-0 max-w-sm overflow-hidden">
        <Dialog.Header onClose={onClose} title="Select Network" />
        {networks.map((chainId) => (
          <Typography
            as="button"
            onClick={() => handleSelect(chainId)}
            key={chainId}
            variant="sm"
            className={classNames(
              selected === chainId ? 'text-slate-200 !font-medium hover:text-white' : 'text-slate-400 hover:text-white',
              'flex w-full items-center gap-1.5 cursor-pointer pr-3 pl-1.5 group hover:bg-blue py-1'
            )}
          >
            {selected === chainId ? (
              <div className="flex items-center justify-center w-8 h-8">
                <CheckIcon width={24} height={24} className="group-hover:text-white text-blue" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-8 h-8">
                <NetworkIcon type="naked" chainId={chainId} width={24} height={24} />
              </div>
            )}
            {chains[chainId].name}
          </Typography>
        ))}
      </Dialog.Content>
    </Dialog>
  )
}
