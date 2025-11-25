'use client'

import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/solid'
import {
  Badge,
  Button,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
  IconButton,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { type FC, useState } from 'react'
import { getNetworkName } from 'src/lib/network'
import type { EvmChainId } from 'sushi/evm'
import { useConnection } from 'wagmi'

interface MobileNetworkSelector {
  networks: readonly EvmChainId[]
  onSelect: (chainId: number) => void
  selectedNetwork: EvmChainId
}

export const MobileNetworkSelector: FC<MobileNetworkSelector> = ({
  networks,
  selectedNetwork,
  onSelect,
}) => {
  const [open, setOpen] = useState(false)

  const { chainId } = useConnection()

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {networks.slice(0, 10).map((network) => (
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
                    chainId === network && 'bg-green',
                  )}
                />
              }
            >
              <NetworkIcon chainId={network} width={32} height={32} />
            </Badge>
          </Button>
        ))}
        <Button
          className="!w-12 !h-12"
          variant="secondary"
          onClick={() => setOpen(true)}
        >
          +{networks.length - 10}
        </Button>
      </div>
      {open ? (
        <div className="absolute inset-0 z-20 p-6 bg-gray-100 dark:bg-slate-800 rounded-t-2xl">
          <DialogPrimitive.Close asChild className="absolute top-6 right-6">
            <IconButton icon={XMarkIcon} name="Close" />
          </DialogPrimitive.Close>
          <div className="flex flex-col gap-4 h-full">
            <DialogHeader>
              <DialogTitle className="flex gap-2 items-center">
                <IconButton
                  size="sm"
                  onClick={() => setOpen(false)}
                  icon={ArrowLeftIcon}
                  name="Back"
                  variant="ghost"
                />
                <span className="text-xl">Select a chain</span>
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto">
              {networks.map((network) => (
                <Button
                  key={network}
                  className="flex items-center !justify-normal gap-3 !h-16 !px-2 !py-5"
                  fullWidth
                  variant="ghost"
                  onClick={() => {
                    onSelect(network)
                    setOpen(false)
                  }}
                >
                  <Badge
                    position="bottom-right"
                    badgeContent={
                      <div
                        className={classNames(
                          'rounded-full w-2 h-2 mr-0.5 mb-0.5',
                          chainId === network && 'bg-green',
                        )}
                      />
                    }
                  >
                    <NetworkIcon chainId={network} width={28} height={28} />
                  </Badge>
                  <span>{getNetworkName(network)}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
