import { CheckCircleIcon } from '@heroicons/react-v1/solid'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  classNames,
} from '@sushiswap/ui'
import { Switch } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'next/navigation'
import { SUPPORTED_CHAIN_IDS, TWAP_SUPPORTED_CHAIN_IDS } from 'src/config'
import { EvmChainKey } from 'sushi'
import type { EvmChainId } from 'sushi/chain'
import { useTradeTablesContext } from '../trade-tables-context'

export const TradeTableFilters = () => {
  const { theme } = useTheme()
  const {
    chainIds,
    onChainChange,
    setShowCurrentPairOnly,
    showCurrentPairOnly,
  } = useTradeTablesContext()

  const searchParams = useSearchParams()
  const isMarketHistoryTabSelected =
    searchParams.get('history-table-tab') === 'market'
  const networkOptions = isMarketHistoryTabSelected
    ? SUPPORTED_CHAIN_IDS
    : TWAP_SUPPORTED_CHAIN_IDS

  const isDarkMode = theme === 'dark'

  const firstThreeChainIds = networkOptions.slice(0, 2)
  const remainingChainIds = networkOptions.slice(2)

  return (
    <div className="flex items-center w-full justify-between xl:justify-end gap-3 px-5 pt-3 pb-1 md:px-3 xl:px-0 md:pt-0 md:pb-0 bg-[#F9FAFB] xl:!bg-background md:bg-white md:dark:bg-slate-800 dark:bg-background  overflow-x-auto hide-scrollbar">
      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap dark:text-slate-500">
          Show Current Pair Only
        </span>
        <Switch
          checked={showCurrentPairOnly}
          onCheckedChange={(checked) => setShowCurrentPairOnly(checked)}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm whitespace-nowrap dark:text-slate-500">
          Chains:
        </span>
        <div className="flex items-center gap-2">
          {firstThreeChainIds.map((chainId) => {
            const isSelected = chainIds.includes(chainId)
            return (
              <Button
                key={chainId}
                asChild
                type="button"
                onClick={() => {
                  onChainChange(chainId)
                }}
                className={classNames(
                  'dark:border-[#222137] !p-2 border-[#F5F5F5] lg:!border-[#00000014] dark:lg:!border-[#FFFFFF14] border !rounded-lg overflow-hidden relative',
                  !isSelected && 'lg:bg-white dark:lg:bg-slate-800',
                )}
                variant={
                  isSelected && isDarkMode
                    ? 'quaternary'
                    : isSelected
                      ? 'quinary'
                      : 'ghost'
                }
              >
                <NetworkIcon
                  type="square"
                  chainId={chainId}
                  className={`rounded-[4px] w-5 aspect-1 `}
                />
              </Button>
            )
          })}
          {remainingChainIds.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={classNames(
                    'border border-black/10 dark:border-white/10 rounded-lg p-2 flex items-center justify-center',
                  )}
                >
                  <EllipsisHorizontalIcon
                    width={24}
                    height={24}
                    className="text-slate-500 dark:text-slate-400"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-[195px] overflow-y-auto hide-scrollbar !bg-slate-50 dark:!bg-slate-900 !backdrop-blur-none"
              >
                <DropdownMenuGroup className="">
                  {remainingChainIds.map((chainId) => {
                    const isSelected = chainIds.includes(chainId)
                    return (
                      <DropdownMenuItem
                        key={chainId}
                        onClick={(e) => {
                          e.preventDefault()
                          onChainChange(chainId)
                        }}
                        className={classNames('pr-10 my-1')}
                      >
                        <NetworkIcon
                          type="square"
                          chainId={chainId}
                          className={`rounded-[4px] w-5 h-5`}
                        />
                        <span className="ml-2">
                          {EvmChainKey[
                            chainId as EvmChainId
                          ].toLocaleUpperCase()}
                        </span>
                        {isSelected && (
                          <CheckCircleIcon className="w-5 h-5 ml-1 text-blue/50 dark:text-skyblue/50" />
                        )}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </div>
  )
}
