'use client'

import { Badge, Button, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { FC } from 'react'
import type { KinesisChainId } from '~kadena/cross-chain-swap/derivedstate-cross-chain-swap-provider'

interface MobileNetworkSelector {
  networks: KinesisChainId[]
  onSelect: (chainId: number) => void
  selectedNetwork: KinesisChainId
}

export const MobileNetworkSelector: FC<MobileNetworkSelector> = ({
  networks,
  selectedNetwork,
  onSelect,
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {networks.map((network) => (
          <Button
            key={network}
            className={classNames(
              selectedNetwork === network
                ? 'border-blue'
                : 'border-transparent',
              'border !w-12 !h-12',
            )}
            variant="secondary"
            onClick={() => onSelect(network)}
          >
            <Badge
              position="bottom-right"
              badgeContent={
                <div
                  className={classNames(
                    'rounded-full w-2 h-2 mr-0.5 mb-0.5',
                    network === selectedNetwork && 'bg-green',
                  )}
                />
              }
            >
              <NetworkIcon chainId={network} width={32} height={32} />
            </Badge>
          </Button>
        ))}
      </div>
    </>
  )
}
