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
import { useState } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { type EvmChainId, EvmChainKey } from 'sushi'

export const NetworkMenu = ({ className }: { className?: string }) => {
  //TODO: bring this out to a context or global state
  const [tempNetworkState, setTempNetworkState] = useState<null | number>(null)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={classNames(
            'flex items-center font-medium !gap-1',
            className,
          )}
        >
          {tempNetworkState === null ? (
            'All Networks'
          ) : (
            <NetworkItem chainId={tempNetworkState} />
          )}
          <ChevronDownIcon width={16} height={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[205px] overflow-y-auto hide-scrollbar !bg-slate-50 dark:!bg-slate-900 !backdrop-blur-none"
      >
        <DropdownMenuGroup className="font-medium">
          <DropdownMenuItem onClick={() => setTempNetworkState(null)}>
            <div>All Networks</div>
          </DropdownMenuItem>
          {SUPPORTED_CHAIN_IDS.map((chainId) => (
            <DropdownMenuItem
              key={chainId}
              onClick={() => setTempNetworkState(chainId)}
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
  const chainName = EvmChainKey[chainId as EvmChainId]
  return (
    <div className="flex items-center gap-1 text-muted-foreground dark:text-pink-200">
      <NetworkIcon chainId={chainId} width={16} height={16} />
      {/* TODO: make a util for this */}
      <div>{`${chainName.slice(0, 1).toUpperCase()}${chainName.slice(1)}`}</div>
    </div>
  )
}
