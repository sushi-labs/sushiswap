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
  useBreakpoint,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { useState } from 'react'
import { getNetworkName } from 'src/lib/network'
import { useChainIds } from 'src/lib/wallet/hooks/use-chain-ids'
import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { useTokenSelectorTheme } from './token-selector-theme'

const MAX_VISIBLE_NETWORKS = 6

interface MobileNetworkSelector<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
> {
  networks: readonly TChainId[]
  onSelect: (chainId: TChainId) => void
  selectedNetwork: TChainId
}

export function MobileNetworkSelector<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
>({ networks, selectedNetwork, onSelect }: MobileNetworkSelector<TChainId>) {
  const theme = useTokenSelectorTheme()
  const [open, setOpen] = useState(false)

  const chainIds = useChainIds()
  const overflowCount = Math.max(networks.length - MAX_VISIBLE_NETWORKS, 0)
  const { isMd } = useBreakpoint('md')

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {networks.slice(0, MAX_VISIBLE_NETWORKS).map((network) => (
          <Button
            key={network}
            className={classNames(
              selectedNetwork === network
                ? 'border-blue'
                : 'border-transparent',
              'border !md:w-12 !w-8 !h-8 !md:h-12 !min-w-8 !min-h-8 !md:!min-w-12 !md:!min-h-12',
            )}
            variant={theme === 'perps' ? 'perps-secondary' : 'secondary'}
            onClick={() => onSelect(network)}
          >
            <Badge
              position="bottom-right"
              badgeContent={
                <div
                  className={classNames(
                    'rounded-full w-2 h-2 mr-0.5 mb-0.5',
                    chainIds?.includes(network) && 'bg-green',
                  )}
                />
              }
            >
              <NetworkIcon
                chainId={network}
                width={isMd ? 32 : 20}
                height={isMd ? 32 : 20}
              />
            </Badge>
          </Button>
        ))}
        {overflowCount > 0 ? (
          <Button
            className=" !md:w-12 !w-8 !h-8 !md:h-12 !min-w-8 !min-h-8 !md:!min-w-12 !md:!min-h-12 !text-xs"
            variant={theme === 'perps' ? 'perps-secondary' : 'secondary'}
            onClick={() => setOpen(true)}
          >
            +{overflowCount}
          </Button>
        ) : null}
      </div>
      {open ? (
        <div
          className={classNames(
            'absolute inset-0 z-20 rounded-t-2xl p-6',
            theme === 'perps'
              ? 'bg-perps-background text-perps-muted'
              : 'bg-gray-100 dark:bg-slate-800',
          )}
        >
          <DialogPrimitive.Close asChild className="absolute top-6 right-6">
            <IconButton
              icon={XMarkIcon}
              name="Close"
              variant={theme === 'perps' ? 'perps-secondary' : 'secondary'}
            />
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
                          chainIds?.includes(network) && 'bg-green',
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
