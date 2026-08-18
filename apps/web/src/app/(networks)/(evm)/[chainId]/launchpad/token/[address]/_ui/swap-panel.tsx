'use client'

import { ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import {
  SlippageToleranceStorageKey,
  useSlippageTolerance,
} from '@sushiswap/hooks'
import {
  Button,
  Currency,
  SettingsModule,
  SettingsOverlay,
  classNames,
} from '@sushiswap/ui'
import { useCallback, useMemo, useState } from 'react'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { CheckerProvider } from 'src/lib/wagmi/systems/checker/provider'
import { EdgeProvider } from 'src/providers/edge-config-provider'
import { formatUSD, isWNativeSupported } from 'sushi'
import { DEFAULT_SLIPPAGE, type EvmToken, unwrapEvmToken } from 'sushi/evm'
import { formatUnits } from 'viem'
import { DetailsInteractionTrackerProvider } from '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider'
import {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
  useSimpleSwapTradeQuote,
} from '~evm/[chainId]/(trade)/swap/_ui/derivedstate-simple-swap-provider'
import { SimpleSwapTradeButton } from '~evm/[chainId]/(trade)/swap/_ui/simple-swap-trade-button'
import { defaultSwapEdgeConfig } from '~evm/[chainId]/(trade)/swap/get-swap-edge-config'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { LaunchpadTokenWithCurrencies } from '../../../_lib/use-launchpad-token'
import { TokenAvatar } from '../../../_ui/token-avatar'
import type { LaunchpadChainId } from '../../../constants'

type SwapSide = 'BUY' | 'SELL'

// const LOW_LIQUIDITY_THRESHOLD_USD = 100_000
const LOW_LIQUIDITY_SWAP_FEE = 0.01
const LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS = {
  storageKey: SlippageToleranceStorageKey.LaunchpadTokenSwap,
  defaultValue: '10',
} as const

// function getLaunchpadSwapFee(
//   liquidityUsd: number | null | undefined,
// ): number | undefined {
//   return liquidityUsd !== null &&
//     liquidityUsd !== undefined &&
//     Number.isFinite(liquidityUsd) &&
//     liquidityUsd < LOW_LIQUIDITY_THRESHOLD_USD
//     ? LOW_LIQUIDITY_SWAP_FEE
//     : undefined
// }

const BUY_PRESET_VALUES = [
  { value: 1n, decimals: 2 },
  { value: 25n, decimals: 3 },
  { value: 5n, decimals: 2 },
  { value: 1n, decimals: 1 },
] as const

function getBuyPresetAmounts(price: number | undefined): string[] {
  if (!price || !Number.isFinite(price) || price <= 0) {
    return ['0.1', '0.25', '0.5', '1']
  }

  const exponent = Math.max(
    -12,
    Math.min(12, Math.round(3 - Math.log10(price))),
  )

  return BUY_PRESET_VALUES.map(({ value, decimals }) => {
    const adjustedDecimals = decimals - exponent

    if (adjustedDecimals >= 0) {
      return formatUnits(value, adjustedDecimals)
    }

    return formatUnits(value * 10n ** BigInt(-adjustedDecimals), 0)
  })
}

export function SwapPanel({ token }: { token: LaunchpadTokenWithCurrencies }) {
  const defaultQuoteCurrency = unwrapEvmToken(token.quoteCurrency)

  return (
    <EdgeProvider config={defaultSwapEdgeConfig}>
      <CheckerProvider>
        <DerivedstateSimpleSwapProvider
          key={token.address}
          chainId={token.chainId}
          token0={defaultQuoteCurrency}
          token1={token.currency}
          initialSwapAmount="0.1"
          persistToUrl={false}
          fee={LOW_LIQUIDITY_SWAP_FEE}
          slippageToleranceOptions={LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS}
          directPool={{
            address: token.pool.address,
            quoteTokenAddress: token.quoteCurrency.address,
            launchTokenAddress: token.currency.address,
            feeTier: token.pool.feeTier,
          }}
        >
          <DetailsInteractionTrackerProvider>
            <SwapPanelContent token={token} launchToken={token.currency} />
          </DetailsInteractionTrackerProvider>
        </DerivedstateSimpleSwapProvider>
      </CheckerProvider>
    </EdgeProvider>
  )
}

function SwapPanelContent({
  token,
  launchToken,
}: {
  token: LaunchpadTokenWithCurrencies
  launchToken: EvmToken
}) {
  const [side, setSide] = useState<SwapSide>('BUY')
  const [slippageTolerance] = useSlippageTolerance(
    LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS.storageKey,
    LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS.defaultValue,
  )
  const displayedSlippage =
    slippageTolerance === 'AUTO' ? DEFAULT_SLIPPAGE : slippageTolerance
  const {
    mutate: { setSwapAmount, setToken0, setToken1, switchTokens },
    state: { chainId, swapAmountString, token0, token1 },
  } = useDerivedStateSimpleSwap<LaunchpadChainId>()
  const {
    data: quote,
    isFetching: isQuoteFetching,
    isLoading: isQuoteLoading,
  } = useSimpleSwapTradeQuote()
  const { data: token0Balance } = useAmountBalance(token0)
  const { data: token1Balance } = useAmountBalance(token1)
  const { data: inputCurrencyPrice } = useCurrencyPrice({ currency: token0 })
  const { data: outputCurrencyPrice } = useCurrencyPrice({ currency: token1 })
  const buyPresetAmounts = useMemo(
    () =>
      getBuyPresetAmounts(
        side === 'BUY' ? inputCurrencyPrice : outputCurrencyPrice,
      ),
    [inputCurrencyPrice, outputCurrencyPrice, side],
  )

  const numericAmount = Number(swapAmountString) || 0
  const inputUsd = numericAmount * (inputCurrencyPrice ?? 0)
  const output = useMemo(() => {
    const value = quote?.amountOut?.toSignificant(12)
    if (!value) return ''

    return Number(value).toLocaleString('en-US', {
      maximumFractionDigits: side === 'SELL' ? 6 : 2,
    })
  }, [quote?.amountOut, side])

  function changeSide(nextSide: SwapSide) {
    if (nextSide === side) return

    switchTokens()
    setSide(nextSide)
    setSwapAmount(nextSide === 'BUY' ? buyPresetAmounts[0] : '')
  }

  function selectCounterCurrency(
    currency: CurrencyFor<LaunchpadChainId>,
  ): void {
    if (currency.isSame(launchToken)) return

    if (side === 'BUY') {
      setToken0(currency)
    } else {
      setToken1(currency)
    }
  }

  function applyPreset(preset: string): void {
    if (side === 'BUY') {
      setSwapAmount(preset)
      return
    }

    if (!token0Balance) return

    const percentage = preset === 'Max' ? 100 : Number.parseInt(preset, 10)
    setSwapAmount(token0Balance.mul(BigInt(percentage)).div(100n).toString())
  }

  const handleMaxAmount = useCallback(() => {
    if (!token0Balance) return
    if (token0Balance.currency.type === 'native') {
      const token0BalanceMinusGas = token0Balance
        .subHuman('0.000004')
        .toString()
      setSwapAmount(token0BalanceMinusGas)
      return
    }
    setSwapAmount(token0Balance.toString())
  }, [setSwapAmount, token0Balance])

  const tokenPillClassName =
    'flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-2 text-sm font-semibold text-perps-muted shadow-sm'
  const inputTokenPill =
    side === 'BUY' ? (
      <button
        type="button"
        aria-label="Select token to pay with"
        className={tokenPillClassName}
      >
        {token0 ? (
          <Currency.Icon disableLink currency={token0} width={32} height={32} />
        ) : null}
        {token0?.symbol}
        <ChevronDownIcon className="h-4 w-4" />
      </button>
    ) : (
      <div className={tokenPillClassName}>
        <TokenAvatar token={token} size="sm" />
        {token.symbol}
      </div>
    )
  const outputTokenPill =
    side === 'SELL' ? (
      <button
        type="button"
        aria-label="Select token to receive"
        className={tokenPillClassName}
      >
        {token1 ? (
          <Currency.Icon disableLink currency={token1} width={32} height={32} />
        ) : null}
        {token1?.symbol}
        <ChevronDownIcon className="h-4 w-4" />
      </button>
    ) : (
      <div className={tokenPillClassName}>
        <TokenAvatar token={token} size="sm" />
        {token.symbol}
      </div>
    )

  return (
    <PerpsCard className="p-4 sm:p-5" fullWidth>
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="font-semibold text-perps-muted">
            Trade {token.symbol}
          </div>
        </div>
        <SettingsOverlay
          modules={[SettingsModule.SlippageTolerance]}
          options={{
            slippageTolerance: LAUNCHPAD_SLIPPAGE_TOLERANCE_OPTIONS,
          }}
          theme="perps"
        >
          <Button
            variant="perps-secondary"
            size="sm"
            aria-label="Swap settings"
          >
            <span className="text-xs font-semibold tabular-nums">
              {displayedSlippage}%
            </span>
            <Cog6ToothIcon className="h-5 w-5" />
          </Button>
        </SettingsOverlay>
      </div>

      <div className="mt-5 grid grid-cols-2 rounded-xl bg-white/[0.04] p-1">
        {(['BUY', 'SELL'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => changeSide(item)}
            className={classNames(
              'rounded-lg py-2.5 text-sm font-semibold transition',
              side === item
                ? item === 'BUY'
                  ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                  : 'bg-red/15 text-red shadow-sm'
                : 'text-perps-muted-50 hover:text-perps-muted',
            )}
          >
            {item === 'BUY' ? 'Buy' : 'Sell'}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-white/[0.04] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between text-xs text-perps-muted-50">
          <span>You pay</span>
          <button type="button" onClick={handleMaxAmount}>
            Balance: {token0Balance?.toSignificant(6) ?? '0'}
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input
            value={swapAmountString}
            inputMode="decimal"
            onChange={(event) => setSwapAmount(event.target.value)}
            aria-label="Swap input amount"
            className="min-w-0 flex-1 bg-transparent text-3xl font-medium tracking-tight text-perps-muted outline-none"
            placeholder="0.0"
          />
          {side === 'BUY' ? (
            <TokenSelector
              chainId={chainId}
              selected={token0}
              onSelect={selectCounterCurrency}
              includeNative={isWNativeSupported(chainId)}
              theme="perps"
            >
              {inputTokenPill}
            </TokenSelector>
          ) : (
            inputTokenPill
          )}
        </div>
        <div className="mt-3 text-xs text-perps-muted-50">
          {inputUsd > 0 ? `≈ ${formatUSD(inputUsd)}` : '—'}
        </div>
      </div>

      <div className="my-3 grid grid-cols-4 gap-2">
        {(side === 'BUY' ? buyPresetAmounts : ['25%', '50%', '75%', 'Max']).map(
          (preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyPreset(preset)}
              disabled={side === 'SELL' && !token0Balance?.gt(0n)}
              className="rounded-lg bg-white/[0.04] py-1.5 text-xs font-medium text-perps-muted-50 transition hover:bg-white/[0.08] hover:text-perps-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {preset}
            </button>
          ),
        )}
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-white/[0.04] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
        <div
          aria-hidden="true"
          data-state={isQuoteFetching || isQuoteLoading ? 'active' : 'inactive'}
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden transition-all before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-slate-50/10 before:to-transparent data-[state=inactive]:hidden data-[state=active]:block"
        />
        <div className="flex items-center justify-between text-xs text-perps-muted-50">
          <span>You receive</span>
          <span>Balance: {token1Balance?.toSignificant(6) ?? '0'}</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div
            className={classNames(
              'min-w-0 flex-1 truncate text-3xl font-medium tracking-tight text-perps-muted',
              !output && 'text-perps-muted-50',
            )}
          >
            {output || '0.0'}
          </div>
          {side === 'SELL' ? (
            <TokenSelector
              chainId={chainId}
              selected={token1}
              onSelect={selectCounterCurrency}
              includeNative={isWNativeSupported(chainId)}
              theme="perps"
            >
              {outputTokenPill}
            </TokenSelector>
          ) : (
            outputTokenPill
          )}
        </div>
      </div>

      <div className="mt-4">
        <SimpleSwapTradeButton variant="perps" />
      </div>
    </PerpsCard>
  )
}
