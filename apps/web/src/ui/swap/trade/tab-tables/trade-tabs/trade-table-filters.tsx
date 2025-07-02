import { Button, Loader, classNames } from '@sushiswap/ui'
import { Switch } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { TWAP_SUPPORTED_CHAIN_IDS } from 'src/config'
import { useTradeTablesContext } from '../trade-tables-context'

export const TradeTableFilters = () => {
  const { theme } = useTheme()
  const {
    chainIds,
    onChainChange,
    setShowCurrentPairOnly,
    showCurrentPairOnly,
    isChainLoadingCallback,
  } = useTradeTablesContext()

  const isDarkMode = theme === 'dark'

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
          {TWAP_SUPPORTED_CHAIN_IDS.map((chainId) => {
            const isSelected = chainIds.includes(chainId)
            const isLoading = isChainLoadingCallback(chainId)

            return (
              <Button
                key={chainId}
                asChild
                type="button"
                onClick={() => {
                  if (isLoading) return
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
                {isLoading && (
                  <div
                    className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2`}
                  >
                    <Loader size={16} />
                  </div>
                )}
                <NetworkIcon
                  type="square"
                  chainId={chainId}
                  className={`rounded-[4px] w-5 aspect-1 ${isLoading ? 'opacity-0' : ''}`}
                />
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
