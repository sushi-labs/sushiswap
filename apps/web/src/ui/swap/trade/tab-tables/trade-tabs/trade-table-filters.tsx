import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'

import { Button, classNames } from '@sushiswap/ui'

import { useDarkMode } from '@sushiswap/hooks'
import { Switch } from '@sushiswap/ui'
import { useState } from 'react'

export const TradeTableFilters = () => {
  const [showCurrentPairOnly, setShowCurrentPairOnly] = useState(false)
  const [chainsToShow, setChainsToShow] = useState<number[]>([])
  const isDarkMode = useDarkMode()

  const ALL_CHAINS_IN_TABLE = [1, 43114]

  return (
    <div className="flex items-center gap-3 px-5 pt-3 pb-1 md:px-0 md:pt-0 md:pb-0 bg-[#F9FAFB] dark:bg-slate-900">
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
          Chains
        </span>
        <div className="flex items-center gap-2">
          {ALL_CHAINS_IN_TABLE.map((chainId) => (
            <Button
              key={chainId}
              asChild
              type="button"
              onClick={() =>
                setChainsToShow((prev) =>
                  prev.includes(chainId)
                    ? prev.filter((id) => id !== chainId)
                    : [...prev, chainId],
                )
              }
              className={classNames(
                'dark:border-[#222137] !p-2 border-[#F5F5F5] border !rounded-lg overflow-hidden',
              )}
              variant={
                chainsToShow.includes(chainId) && isDarkMode
                  ? 'quaternary'
                  : chainsToShow.includes(chainId)
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
          ))}
        </div>
      </div>
    </div>
  )
}
