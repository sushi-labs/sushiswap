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
import type { EvmChainId } from 'sushi'

export const NetworkMenu = ({
  className,
  selectedNetwork,
  onNetworkSelect,
  networkOptions,
  triggerVariant = 'ghost',
  triggerIcon,
  triggerText = 'All Networks',
}: {
  className?: string
  selectedNetwork?: null | number
  onNetworkSelect?(val: number | null): void
  networkOptions?: number[]
  triggerVariant?: 'networks' | 'ghost' | 'secondary'
  triggerIcon?: React.ReactNode
  triggerText?: string
}) => {
  const { networkOptions: _networks } = useNetworkOptions()

  const networks = networkOptions ?? _networks

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          className={classNames(
            'flex items-center font-medium !gap-1 !px-2 !pl-4',
            className,
          )}
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
        className="max-h-[205px] overflow-y-auto hide-scrollbar !bg-slate-50 dark:!bg-slate-900 !backdrop-blur-none"
      >
        <DropdownMenuGroup className="font-medium">
          <DropdownMenuItem onClick={() => onNetworkSelect?.(null)}>
            <div>All Networks</div>
          </DropdownMenuItem>
          {networks?.map((chainId) => (
            <DropdownMenuItem
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

const NetworkItem = ({ chainId }: { chainId: number }) => {
  return (
    <div className="flex gap-1 items-center text-muted-foreground dark:text-pink-200">
      <NetworkIcon chainId={chainId} width={16} height={16} />
      <div>{getNetworkName(chainId as EvmChainId)}</div>
    </div>
  )
}
