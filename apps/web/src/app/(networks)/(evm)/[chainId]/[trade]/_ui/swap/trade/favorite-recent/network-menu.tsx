'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useNetworkOptions } from 'src/lib/hooks/useNetworkOptions'
import { getNetworkName } from 'src/lib/network'
import type { EvmChainId } from 'sushi/evm'

export const NetworkMenu = ({
  className,
  selectedNetwork,
  onNetworkSelect,
  networkOptions,
  triggerVariant = 'ghost',
  triggerIcon,
  triggerText = 'All Networks',
  testId,
}: {
  className?: string
  selectedNetwork?: EvmChainId | null
  onNetworkSelect?(val: EvmChainId | null): void
  networkOptions?: EvmChainId[]
  triggerVariant?: 'networks' | 'ghost' | 'secondary'
  triggerIcon?: React.ReactNode
  triggerText?: string
  testId?: string
}) => {
  const { networkOptions: _networks } = useNetworkOptions()

  const networks = networkOptions ?? _networks

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          className={classNames(
            'flex items-center font-medium !gap-1 !px-2 !pl-3',
            className,
          )}
          testId={testId ?? 'network-menu-dropdown-trigger'}
        >
          {triggerIcon}
          {selectedNetwork === null || !selectedNetwork ? (
            triggerText
          ) : (
            <NetworkItem chainId={selectedNetwork} />
          )}
          <ChevronDownIcon width={16} height={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[205px] overflow-y-auto !bg-slate-50 dark:!bg-slate-900 !backdrop-blur-none"
      >
        <DropdownMenuGroup className="font-medium">
          <DropdownMenuItem
            testdata-id={`network-menu-dropdown-menu-item-all-networks`}
            onClick={() => onNetworkSelect?.(null)}
          >
            <div>All Networks</div>
          </DropdownMenuItem>
          {networks?.map((chainId) => (
            <DropdownMenuItem
              testdata-id={`network-menu-dropdown-menu-item-${chainId}`}
              key={chainId}
              onClick={() => onNetworkSelect?.(chainId)}
            >
              <NetworkItem chainId={chainId} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const NetworkItem = ({ chainId }: { chainId: EvmChainId }) => {
  return (
    <div className="flex items-center gap-1 text-muted-foreground dark:text-pink-200">
      <NetworkIcon chainId={chainId} width={16} height={16} />
      <div>{getNetworkName(chainId)}</div>
    </div>
  )
}
