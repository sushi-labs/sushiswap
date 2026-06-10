'use client'

import { Module, Partners, SpotProvider } from '@orbs-network/spot-react'
import type { Token as OrbsToken } from '@orbs-network/spot-react'
import { useParams } from 'next/navigation'
import { type ReactNode, useMemo } from 'react'
import { TWAP_MIN_CHUNK_SIZE_USD } from 'src/lib/swap/twap'
import type { CurrencyMetadata } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import type { SvmCurrency } from 'sushi/svm'
import { zeroAddress } from 'viem'
import { useConnection, useWalletClient } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { SwapModeButtons } from '../../_ui/swap-mode-buttons'
import {
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from '../../swap/_ui/derivedstate-simple-swap-provider'
import { SimpleSwapTokenNotFoundDialog } from '../../swap/_ui/simple-swap-token-not-found-dialog'
import { OrbsBanner } from './orbs-banner'
import { SpotSettingsOverlay } from './spot-settings-overlay'
import { TwapOrdersDialogTriggerButton } from './twap-orders-dialog'
import { TwapSwitchTokensButton } from './twap-switch-tokens-button'
import { TwapToken0Input } from './twap-token0-input'
import { TwapToken1Input } from './twap-token1-input'
import { TwapTradeButton } from './twap-trade-button'
import {
  DEFAULT_PRICE_PROTECTION_PERCENT,
  usePriceProtection,
} from './use-price-protection'

// ============ Main export ============

const toSpotToken = (
  token:
    | EvmCurrency<CurrencyMetadata>
    | SvmCurrency<CurrencyMetadata>
    | undefined,
): OrbsToken | undefined => {
  if (!token) return undefined
  return {
    address: token.isNative ? zeroAddress : token.wrap().address,
    symbol: token.symbol,
    decimals: token.decimals,
    logoUrl: '',
  }
}

export function TwapForm({
  module,
  children,
}: {
  module: Module
  children: ReactNode
}) {
  const { chainId: _chainId } = useParams()
  const chainId = _chainId ? +_chainId : undefined
  const { address } = useConnection() as { address?: string }
  const { data: walletClient } = useWalletClient({ chainId })
  const [priceProtection] = usePriceProtection()
  const priceProtectionValue = Number.isFinite(Number(priceProtection))
    ? Number(priceProtection)
    : DEFAULT_PRICE_PROTECTION_PERCENT

  const {
    state: { token0, token1, swapAmountString, chainId: stateChainId },
  } = useDerivedStateSimpleSwap()

  const { data: quote, isInitialLoading: quoteLoading } =
    useSimpleSwapTradeQuote()

  const typedInputAmount = swapAmountString

  const marketReferencePrice = useMemo(
    () => ({
      value: quote?.amountOut?.amount.toString(),
      isLoading: quoteLoading,
      noLiquidity:
        Boolean(swapAmountString) && !quoteLoading && !quote?.amountOut,
    }),
    [quote?.amountOut, quote, quoteLoading, swapAmountString],
  )

  const inputBalance = useAmountBalance(token0)
  const outputBalance = useAmountBalance(token1)
  const srcBalance = inputBalance?.data?.amount?.toString() ?? '0'
  const dstBalance = outputBalance?.data?.amount?.toString() ?? '0'

  const { data: srcUsd1Token } = usePrice({
    chainId: token0?.chainId,
    address: token0?.wrap().address,
  })

  const { data: dstUsd1Token } = usePrice({
    chainId: token1?.chainId,
    address: token1?.wrap().address,
  })

  const overrides = useMemo(
    () => ({
      state: {
        isMarketOrder: module === Module.TWAP,
      },
    }),
    [module],
  )

  const srcToken = useMemo(() => toSpotToken(token0), [token0])
  const dstToken = useMemo(() => toSpotToken(token1), [token1])

  return (
    <SpotProvider
      partner={Partners.Sushiswap}
      module={module}
      priceProtection={priceProtectionValue}
      minChunkSizeUsd={TWAP_MIN_CHUNK_SIZE_USD}
      typedInputAmount={typedInputAmount}
      marketReferencePrice={marketReferencePrice}
      srcToken={srcToken}
      dstToken={dstToken}
      srcBalance={srcBalance}
      dstBalance={dstBalance}
      srcUsd1Token={srcUsd1Token?.toString()}
      dstUsd1Token={dstUsd1Token?.toString()}
      chainId={stateChainId}
      account={address ?? undefined}
      provider={walletClient?.transport}
      overrides={overrides}
    >
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-[rgba(255,255,255,0.8)] dark:bg-[rgba(25,32,49,0.8)] rounded-3xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <SwapModeButtons />
          <SpotSettingsOverlay />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <TwapToken0Input />
            <TwapSwitchTokensButton />
            <TwapToken1Input />
          </div>
          {children}
          <TwapTradeButton module={module} />
        </div>
        <TwapOrdersDialogTriggerButton />
        <OrbsBanner />
        <SimpleSwapTokenNotFoundDialog />
      </div>
    </SpotProvider>
  )
}
