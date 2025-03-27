import { Button } from '@sushiswap/ui'
import { ShuffleIcon } from '@sushiswap/ui/icons/ShuffleIcon'
import Link from 'next/link'
import type { FC } from 'react'
import { PathnameButton } from 'src/ui/pathname-button'
import { EvmChainKey } from 'sushi/chain'
import type { Token } from 'sushi/currency'
import { SimpleSwapSettingsOverlay } from '../simple/simple-swap-settings-overlay'
import { SwapMaintenanceMessage } from '../simple/swap-maintenance-message'
import { DerivedstateSwapWidgetProvider } from './derivedstate-swap-widget-provider'
import { SwapWidgetSwitchTokensButton } from './swap-widget-switch-tokens-button'
import { SwapWidgetToken0Input } from './swap-widget-token0-input'
import { SwapWidgetToken1Input } from './swap-widget-token1-input'
import { SwapWidgetTradeButton } from './swap-widget-trade-button'

interface SwapWidgetProps {
  token1: Token
}

export const SwapWidget: FC<SwapWidgetProps> = ({ token1 }) => {
  return (
    <DerivedstateSwapWidgetProvider chainId={token1.chainId} token1={token1}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" size="sm">
              Swap
            </Button>
            <Link
              href={`/${EvmChainKey[token1.chainId]}/limit?token1=${token1.address}`}
            >
              <PathnameButton
                pathname={`/${EvmChainKey[token1.chainId]}/limit?token1=${token1.address}`}
                size="sm"
              >
                Limit
              </PathnameButton>
            </Link>
            <Link
              href={`/${EvmChainKey[token1.chainId]}/dca?token1=${token1.address}`}
            >
              <PathnameButton
                pathname={`/${EvmChainKey[token1.chainId]}/dca?token1=${token1.address}`}
                size="sm"
              >
                DCA
              </PathnameButton>
            </Link>
            <Link
              href={`/${EvmChainKey[token1.chainId]}/cross-chain-swap?token0=${token1.address}`}
            >
              <PathnameButton
                pathname={`/${EvmChainKey[token1.chainId]}/cross-chain-swap?token0=${token1.address}`}
                size="sm"
              >
                <span className="saturate-200 flex items-center gap-2 bg-gradient-to-r from-blue to-pink bg-clip-text text-transparent">
                  <ShuffleIcon width={20} height={20} className="text-blue" />
                  Cross-Chain
                </span>
              </PathnameButton>
            </Link>
          </div>
          <SimpleSwapSettingsOverlay />
        </div>
        <SwapMaintenanceMessage />
        <SwapWidgetToken0Input />
        <SwapWidgetSwitchTokensButton />
        <SwapWidgetToken1Input />
        <SwapWidgetTradeButton />
      </div>
    </DerivedstateSwapWidgetProvider>
  )
}
