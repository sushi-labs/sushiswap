'use client'

import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/20/solid'
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
import { FC, useState } from 'react'
import { getNetworkName } from 'src/lib/network'
import { ChainId } from 'sushi/chain'
import { useAccount } from 'wagmi'

interface MobileNetworkSelector {
  networks: readonly ChainId[]
  onSelect: (chainId: number) => void
  selectedNetwork: ChainId
}

export const MobileNetworkSelector: FC<MobileNetworkSelector> = ({
  networks,
  selectedNetwork,
  onSelect,
}) => {
  const [open, setOpen] = useState(false)

  const { chainId } = useAccount()

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {networks.slice(6).map((network) => (
          <Button
            key={network}
            className={classNames(
              selectedNetwork === network
                ? 'border-blue'
                : 'border-transparent',
              'border flex-grow-0 !px-2',
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
          className="w-12 h-12"
          variant="secondary"
          onClick={() => setOpen(true)}
        >
          +{networks.length - 6}
        </Button>
      </div>
      {open ? (
        <div className="absolute inset-0 z-20 p-5 bg-gray-100 dark:bg-slate-800 rounded-t-2xl">
          <div className="flex flex-col gap-4 h-full">
            <DialogHeader className="flex !flex-row justify-between items-center">
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
              <DialogPrimitive.Close asChild>
                <IconButton icon={XMarkIcon} name="Close" />
              </DialogPrimitive.Close>
            </DialogHeader>
            <div className="overflow-y-auto h-full">
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
