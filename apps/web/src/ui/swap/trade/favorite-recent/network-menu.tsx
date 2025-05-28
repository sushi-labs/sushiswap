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

export const NetworkMenu = () => {
  //TODO: bring this out to a context or global state
  const [tempNetworkState, setTempNetworkState] = useState<null | number>(null)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          className={classNames('flex items-center font-medium !gap-1 !pr-0')}
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
  return (
    <div className="flex items-center gap-1">
      <NetworkIcon chainId={chainId} width={16} height={16} />
      <div>{EvmChainKey[chainId as EvmChainId].toLocaleUpperCase()}</div>
    </div>
  )
}
