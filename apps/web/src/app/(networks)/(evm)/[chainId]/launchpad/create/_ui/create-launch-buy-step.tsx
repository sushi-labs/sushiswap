import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Currency,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Message,
  SelectIcon,
  Slider,
  classNames,
} from '@sushiswap/ui'
import type { UseFormReturn } from 'react-hook-form'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { type Amount, formatUSD } from 'sushi'
import type { EvmAddress, EvmCurrency, EvmToken } from 'sushi/evm'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { formatRawAmount } from '../../_lib/format'
import type { LaunchpadChainId } from '../../constants'
import type { CreateLaunchForm, WethPaymentMode } from './create-launch-types'

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
  initialBuyAmountRaw,
  initialBuyCurrencySymbol,
  quotePriceUsd,
  isQuotePriceLoading,
  maximumInitialBuyUsd,
  initialBuyStepUsd,
  checkerAmounts,
  canNavigateToReview,
  onBack,
  onReview,
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
  initialBuyAmountRaw: bigint | undefined
  initialBuyCurrencySymbol: string | undefined
  quotePriceUsd: number | undefined
  isQuotePriceLoading: boolean
  maximumInitialBuyUsd: number
  initialBuyStepUsd: number
  checkerAmounts: (Amount<EvmCurrency> | undefined)[]
  canNavigateToReview: boolean
  onBack: () => void
  onReview: () => void
}) {
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
          Using SUSHI as the quote asset reduces Sushi&apos;s LP fee share from
          30% to 20%.
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
        name="initialBuyUsd"
        render={({ field }) => (
          <FormItem className="border-t border-white/[0.06] pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-perps-muted">
                  Buy your token at launch
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-perps-muted-50">
                  Optionally make the first purchase atomically with the token
                  launch. Move the slider to choose how much to spend.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xl font-semibold tabular-nums text-perps-muted">
                  {formatUSD(field.value)}
                </div>
                <div className="mt-1 text-xs tabular-nums text-perps-muted-50">
                  {initialBuyAmountRaw !== undefined && selectedQuoteToken
                    ? `${formatRawAmount(
                        initialBuyAmountRaw,
                        selectedQuoteToken.decimals,
                        6,
                      )} ${initialBuyCurrencySymbol ?? selectedQuoteToken.symbol}`
                    : 'Price unavailable'}
                </div>
              </div>
            </div>

            <FormControl>
              <Slider
                aria-label="Initial token purchase in USD"
                className="mt-6"
                min={0}
                max={maximumInitialBuyUsd}
                step={initialBuyStepUsd}
                value={[field.value]}
                disabled={!selectedQuoteToken}
                onValueChange={(nextValues) => {
                  const nextValue = nextValues[0]
                  if (nextValue !== undefined) field.onChange(nextValue)
                }}
                onValueCommit={field.onBlur}
                rangeClassName="!bg-perps-blue"
                thumbClassName="!border-white !bg-perps-blue"
              />
            </FormControl>
            <div className="mt-3 flex justify-between text-xs text-perps-muted-50">
              <span>No buy</span>
              <span>{formatUSD(maximumInitialBuyUsd / 2)}</span>
              <span>{formatUSD(maximumInitialBuyUsd)}</span>
            </div>

            {isQuotePriceLoading ? (
              <div className="mt-5 border-t border-white/[0.06] pt-4 text-sm text-perps-muted-50">
                Loading the quote-token price…
              </div>
            ) : quotePriceUsd !== undefined && selectedQuoteToken ? (
              <div className="mt-5 border-t border-white/[0.06] pt-4 text-sm text-perps-muted-50">
                Current conversion: {formatUSD(quotePriceUsd)} per{' '}
                {selectedQuoteToken.symbol}. The exact minimum token output is
                simulated immediately before submission with 1% tolerance.
              </div>
            ) : selectedQuoteToken ? (
              <Message variant="destructive" size="sm" className="mt-5">
                No trusted USD price is available for{' '}
                {selectedQuoteToken.symbol}. Leave the initial buy at zero,
                choose another quote asset, or try again.
              </Message>
            ) : null}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="perps-secondary"
          icon={ArrowLeftIcon}
          onClick={onBack}
        >
          Back
        </Button>
        <div className="sm:min-w-52">
          <Checker.Connect
            namespace="evm"
            fullWidth
            size="lg"
            variant="perps-default"
            type="button"
          >
            <Checker.Network
              chainId={chainId}
              fullWidth
              size="lg"
              variant="perps-default"
              type="button"
            >
              <Checker.Amounts
                chainId={chainId}
                amounts={checkerAmounts}
                fullWidth
                size="lg"
                variant="perps-default"
                type="button"
              >
                <Button
                  type="button"
                  fullWidth
                  size="lg"
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
        </div>
      </div>
    </PerpsCard>
  )
}
