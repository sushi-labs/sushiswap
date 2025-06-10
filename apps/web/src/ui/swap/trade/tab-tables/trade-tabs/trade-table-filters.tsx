import { Button, classNames } from '@sushiswap/ui'
import { Switch } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useTheme } from 'next-themes'
import { useState } from 'react'

export const TradeTableFilters = () => {
  const [showCurrentPairOnly, setShowCurrentPairOnly] = useState(false)
  const [chainsToShow, setChainsToShow] = useState<number[]>([])
  const { theme } = useTheme()

  const isDarkMode = theme === 'dark'

  const ALL_CHAINS_IN_TABLE = [1, 43114]

  return (
    <div className="flex items-center w-full justify-between xl:justify-end gap-3 px-5 pt-3 pb-1 md:px-3 xl:px-0 md:pt-0 md:pb-0 bg-[#F9FAFB] xl:!bg-background md:bg-white md:dark:bg-slate-800 dark:bg-background">
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
          {ALL_CHAINS_IN_TABLE.map((chainId) => {
            const isSelected = chainsToShow.includes(chainId)

            return (
              <Button
                key={chainId}
                asChild
                type="button"
                onClick={() => {
                  console.log(`Toggling chain ${chainId}`)
                  setChainsToShow((prev) => {
                    const newSelection = prev.includes(chainId)
                      ? prev.filter((id) => id !== chainId)
                      : [...prev, chainId]

                    return newSelection
                  })
                }}
                className={classNames(
                  'dark:border-[#222137] !p-2 border-[#F5F5F5] lg:!border-[#00000014] dark:lg:!border-[#FFFFFF14] border !rounded-lg overflow-hidden',
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
                  className="rounded-[4px] w-5 aspect-1"
                />
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
