import React, { FC, useCallback } from 'react'
import { Switch } from '@sushiswap/ui/components/switch'
import { useSwapActions, useSwapState } from '../trade/TradeProvider'
import { AppType } from '@sushiswap/ui/types'
import { classNames } from '@sushiswap/ui'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { ChainSelectors } from './ChainSelectors'
import { Explainer } from '@sushiswap/ui/components/explainer'
import { STARGATE_SUPPORTED_CHAIN_IDS, StargateChainId } from '@sushiswap/stargate'

export const CrossChainBanner: FC = () => {
  const { appType, network0 } = useSwapState()
  const { setAppType } = useSwapActions()

  const handleChange = useCallback(
    (checked: boolean) => {
      if (checked) setAppType(AppType.xSwap)
      else setAppType(AppType.Swap)
    },
    [setAppType]
  )

  return (
    <div
      className={classNames(
        !STARGATE_SUPPORTED_CHAIN_IDS.includes(network0 as StargateChainId) ? 'opacity-40 pointer-events-none' : '',
        'bg-white dark:bg-slate-900 rounded-xl mb-4'
      )}
    >
      <div
        className={classNames(
          'flex flex-col bg-gradient-to-r from-blue/[0.15] to-pink/[0.15] hover:from-blue/20 hover:to-pink/20 saturate-[2] dark:saturate-[1] p-6 rounded-xl'
        )}
      >
        <div className="flex gap-3 items-center">
          <div className="flex flex-col">
            <h1 className="flex gap-1.5 items-center font-semibold text-gray-900 dark:text-slate-50">
              <span className="flex gap-1.5 items-center bg-gradient-to-r from-blue to-pink text-transparent bg-clip-text tracking-tighter">
                Cross Chain
              </span>
              <Explainer iconProps={{ className: 'text-gray-400' }}>
                <div className="flex flex-col gap-3">
                  <span className="text-gray-900 dark:text-slate-50 font-semibold">Cross-chain Swap</span>
                  <span className="text-gray-500 dark:text-slate-400">
                    Swap your funds on one network and swap them into a token on a different network
                  </span>
                  <a
                    target="_blank"
                    className="text-blue dark:text-blue dark:font-semibold flex gap-1 items-center font-medium"
                    href="https://www.sushi.com/academy/articles/sushi-xswap-a-crosschain-dex"
                    rel="noreferrer"
                  >
                    Learn more <ChevronRightIcon width={12} height={12} />
                  </a>
                </div>
              </Explainer>
            </h1>
            <span className="text-sm text-muted-foreground">Swap tokens from one network to another.</span>
          </div>
          <div className="flex justify-end flex-grow">
            <Switch checked={appType === AppType.xSwap} onCheckedChange={handleChange} />
          </div>
        </div>
        <ChainSelectors open={appType === AppType.xSwap} />
      </div>
    </div>
  )
}
