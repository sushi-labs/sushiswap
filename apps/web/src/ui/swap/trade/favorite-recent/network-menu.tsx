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
import { captializeFirstLetter } from 'src/lib/helpers'
import { useNetworkOptions } from 'src/lib/hooks/useNetworkOptions'
import { type EvmChainId, EvmChainKey } from 'sushi'

export const NetworkMenu = ({
  className,
  selectedNetwork,
  onNetworkSelect,
  networkOptions,
}: {
  className?: string
  selectedNetwork?: null | number
  onNetworkSelect?(val: number | null): void
  networkOptions?: number[]
}) => {
  const { networkOptions: _networks } = useNetworkOptions()

  const networks = networkOptions ?? _networks

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={classNames(
            'flex items-center font-medium !gap-1 !px-2 !pl-4',
            className,
          )}
        >
          {selectedNetwork === null || !selectedNetwork ? (
            'All Networks'
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
  const chainName = EvmChainKey[chainId as EvmChainId]
  return (
    <div className="flex items-center gap-1 text-muted-foreground dark:text-pink-200">
      <NetworkIcon chainId={chainId} width={16} height={16} />
      <div>{captializeFirstLetter(chainName)}</div>
    </div>
  )
}
