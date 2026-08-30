import { ArrowRightIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Currency,
  Dots,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Message,
  SelectIcon,
  TextField,
  classNames,
} from '@sushiswap/ui'
import type { UseFormReturn } from 'react-hook-form'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { Amount, formatUSD } from 'sushi'
import type { EvmAddress, EvmCurrency, EvmToken } from 'sushi/evm'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatRawAmount } from '../../_lib/format'
import type { LaunchpadChainId } from '../../constants'
import { LAUNCH_TOKEN_TOTAL_SUPPLY_RAW } from '../_lib/initial-buy-quote'
import type { CreateLaunchForm, WethPaymentMode } from './create-launch-types'

function formatSupplyShare(amountOut: bigint): string {
  if (amountOut === 0n) return '0%'

  const percentageScaled =
    (amountOut * 1_000_000n) / LAUNCH_TOKEN_TOTAL_SUPPLY_RAW
  if (percentageScaled === 0n) return '<0.0001%'

  return `${(Number(percentageScaled) / 10_000).toLocaleString('en-US', {
    maximumFractionDigits: 4,
  })}%`
}

export function CreateLaunchBuyButton({
  chainId,
  checkerAmounts,
  canNavigateToReview,
  onReview,
}: {
  chainId: LaunchpadChainId
  checkerAmounts: (Amount<EvmCurrency> | undefined)[]
  canNavigateToReview: boolean
  onReview: () => void
}) {
  return (
    <Checker.Connect
      namespace="evm"
      fullWidth
      size="default"
      variant="perps-default"
      type="button"
    >
      <Checker.Network
        chainId={chainId}
        fullWidth
        size="default"
        variant="perps-default"
        type="button"
      >
        <Checker.Amounts
          chainId={chainId}
          amounts={checkerAmounts}
          fullWidth
          size="default"
          variant="perps-default"
          type="button"
        >
          <Button
            type="button"
            fullWidth
            size="default"
            variant="perps-default"
            icon={ArrowRightIcon}
            iconPosition="end"
            disabled={!canNavigateToReview}
            onClick={onReview}
          >
            Review launch
          </Button>
        </Checker.Amounts>
      </Checker.Network>
    </Checker.Connect>
  )
}

export function CreateLaunchBuyStep({
  chainId,
  methods,
  selectedQuoteToken,
  quoteTokenMap,
  quoteTokenCount,
  isQuoteTokenListPending,
  isQuoteTokenListError,
  onQuoteTokenSelect,
  isSushiQuoteToken,
  isWethQuoteToken,
  wethPaymentMode,
  onWethPaymentModeChange,
  nativeCurrencySymbol,
  initialBuyCurrency,
  launchFeeRaw,
  initialBuyUsd,
  isQuotePriceLoading,
  estimatedInitialBuyOutputRaw,
  isInitialBuyQuoteLoading,
  isInitialBuyQuoteError,
}: {
  chainId: LaunchpadChainId
  methods: UseFormReturn<CreateLaunchForm>
  selectedQuoteToken: EvmToken | undefined
  quoteTokenMap: Record<string, EvmToken>
  quoteTokenCount: number
  isQuoteTokenListPending: boolean
  isQuoteTokenListError: boolean
  onQuoteTokenSelect: (address: EvmAddress) => void
  isSushiQuoteToken: boolean
  isWethQuoteToken: boolean
  wethPaymentMode: WethPaymentMode
  onWethPaymentModeChange: (mode: WethPaymentMode) => void
  nativeCurrencySymbol: string
  initialBuyCurrency: EvmCurrency | undefined
  launchFeeRaw: bigint | undefined
  initialBuyUsd: number | undefined
  isQuotePriceLoading: boolean
  estimatedInitialBuyOutputRaw: bigint | undefined
  isInitialBuyQuoteLoading: boolean
  isInitialBuyQuoteError: boolean
}) {
  const { data: initialBuyBalance, isLoading: isInitialBuyBalanceLoading } =
    useAmountBalance(initialBuyCurrency)
  const isNativePayment = isWethQuoteToken && wethPaymentMode === 'native'
  const maximumInitialBuy = isNativePayment
    ? initialBuyBalance && launchFeeRaw !== undefined
      ? new Amount(
          initialBuyBalance.currency,
          initialBuyBalance.amount > launchFeeRaw
            ? initialBuyBalance.amount - launchFeeRaw
            : 0n,
        )
      : undefined
    : initialBuyBalance

  return (
    <PerpsCard className="p-5 sm:p-7" fullWidth>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xl font-semibold text-perps-muted">
            Quote asset
          </div>
          <p className="mt-1 text-sm text-perps-muted-50">
            Choose the asset paired with your token in its launch pool.
          </p>
        </div>
        <TokenSelector
          chainId={chainId}
          selected={selectedQuoteToken}
          currencies={quoteTokenMap}
          includeNative={false}
          hideSearch
          theme="perps"
          onSelect={(currency) => onQuoteTokenSelect(currency.wrap().address)}
        >
          <Button
            type="button"
            variant="perps-secondary"
            className="min-w-36"
            disabled={isQuoteTokenListPending || quoteTokenCount === 0}
          >
            {selectedQuoteToken ? (
              <>
                <Currency.Icon
                  disableLink
                  currency={selectedQuoteToken}
                  width={20}
                  height={20}
                />
                {selectedQuoteToken.symbol}
              </>
            ) : isQuoteTokenListPending ? (
              'Loading assets…'
            ) : (
              'No assets available'
            )}
            <SelectIcon />
          </Button>
        </TokenSelector>
      </div>
      {isQuoteTokenListError ? (
        <Message variant="destructive" size="sm" className="mb-6">
          Quote assets could not be loaded. Try again before reviewing your
          launch.
        </Message>
      ) : null}
      {isSushiQuoteToken ? (
        <Message variant="info" size="sm" className="mb-6">
          Sushi&apos;s fee share increases from 20% to 30% when SUSHI is not
          used as the quote asset.
        </Message>
      ) : null}

      {isWethQuoteToken ? (
        <div className="mb-6 border-t border-white/[0.06] pt-6">
          <div className="text-sm font-medium text-perps-muted">Pay with</div>
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] p-1.5 sm:max-w-sm">
            {(
              [
                ['native', nativeCurrencySymbol],
                ['wrapped', selectedQuoteToken?.symbol ?? 'WETH'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => onWethPaymentModeChange(mode)}
                className={classNames(
                  'rounded-lg px-4 py-2.5 text-sm font-medium transition',
                  wethPaymentMode === mode
                    ? 'bg-perps-blue text-white'
                    : 'text-perps-muted-50 hover:text-perps-muted',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-perps-muted-50">
            Paying with {nativeCurrencySymbol} wraps it inside the launch
            transaction. Paying with {selectedQuoteToken?.symbol ?? 'WETH'}
            requires an ERC-20 approval before launch.
          </p>
        </div>
      ) : null}

      <FormField
        control={methods.control}
        name="initialBuyAmount"
        render={({ field }) => (
          <FormItem className="border-t border-white/[0.06] pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-perps-muted">
                  Buy your token at launch
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-perps-muted-50">
                  Optionally make the first purchase atomically with the token
                  launch. Enter the amount you want to spend in the quote asset.
                </p>
              </div>
            </div>

            <FormControl>
              <TextField
                type="number"
                inputMode="decimal"
                maxDecimals={initialBuyCurrency?.decimals}
                aria-label={`Initial token purchase in ${initialBuyCurrency?.symbol ?? 'the quote asset'}`}
                variant="naked"
                className="!h-14 !p-0 !text-xl !text-perps-muted"
                wrapperClassName="mt-6 rounded-xl bg-white/[0.04] px-4"
                unit={initialBuyCurrency?.symbol ?? '—'}
                value={field.value}
                disabled={!selectedQuoteToken}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
              />
            </FormControl>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs tabular-nums text-perps-muted-50">
                {isInitialBuyBalanceLoading ? (
                  <Dots>Balance</Dots>
                ) : initialBuyBalance ? (
                  `Balance: ${initialBuyBalance.toSignificant(6)} ${initialBuyBalance.currency.symbol}`
                ) : (
                  'Connect a wallet to see your balance'
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="perps-secondary"
                  onClick={() => field.onChange('0')}
                >
                  No buy
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="perps-secondary"
                  disabled={!maximumInitialBuy}
                  onClick={() => {
                    if (maximumInitialBuy) {
                      field.onChange(maximumInitialBuy.toString())
                    }
                  }}
                >
                  Max
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/[0.04] p-4">
                <div className="text-xs text-perps-muted-50">
                  Estimated tokens received
                </div>
                <div className="mt-1 text-lg font-semibold tabular-nums text-perps-muted">
                  {isInitialBuyQuoteLoading ? (
                    <Dots>Calculating</Dots>
                  ) : estimatedInitialBuyOutputRaw !== undefined ? (
                    `${formatRawAmount(estimatedInitialBuyOutputRaw, 18, 2)} ${methods.getValues('symbol') || 'tokens'}`
                  ) : (
                    '—'
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-4">
                <div className="text-xs text-perps-muted-50">
                  Estimated supply share
                </div>
                <div className="mt-1 text-lg font-semibold tabular-nums text-perps-muted">
                  {isInitialBuyQuoteLoading ? (
                    <Dots>Calculating</Dots>
                  ) : estimatedInitialBuyOutputRaw !== undefined ? (
                    formatSupplyShare(estimatedInitialBuyOutputRaw)
                  ) : (
                    '—'
                  )}
                </div>
              </div>
            </div>
            {isInitialBuyQuoteError ? (
              <Message variant="destructive" size="sm" className="mt-3">
                The launch-pool estimate is unavailable. Try again before
                reviewing the launch.
              </Message>
            ) : null}

            {isQuotePriceLoading || selectedQuoteToken ? (
              <>
                <div className="!mt-5 border-t border-white/[0.06]" />
                <div className="!mt-0 pt-4 text-sm text-perps-muted-50">
                  {isQuotePriceLoading ? (
                    'Loading USD value…'
                  ) : initialBuyUsd !== undefined ? (
                    <>
                      Approximate value: {formatUSD(initialBuyUsd)}. The minimum
                      token output is simulated again immediately before
                      submission with 1% tolerance.
                    </>
                  ) : (
                    <>
                      USD value unavailable. You can still enter the buy
                      directly in{' '}
                      {initialBuyCurrency?.symbol ?? selectedQuoteToken?.symbol}
                      .
                    </>
                  )}
                </div>
              </>
            ) : null}
            <FormMessage />
          </FormItem>
        )}
      />
    </PerpsCard>
  )
}
