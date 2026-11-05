'use client'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import {
  SlippageToleranceStorageKey,
  TTLStorageKey,
  useDebounce,
} from '@sushiswap/hooks'
import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardFooter,
  CardGroup,
  CardLabel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dots,
  IconButton,
  List,
  SettingsModule,
  SettingsOverlay,
  classNames,
} from '@sushiswap/ui'
import { type ReactElement, useMemo, useState } from 'react'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import {
  DialogConfirm,
  DialogProvider,
  DialogReview,
} from 'src/lib/transaction-dialog'
import {
  getDefaultTTL,
  useTransactionDeadline,
} from 'src/lib/wagmi/hooks/utils/hooks/use-transaction-deadline'
import { Checker } from 'src/lib/wagmi/systems/checker'
import { type Amount, Percent } from 'sushi'
import {
  type EvmCurrency,
  type SushiSwapV4ChainId,
  type SushiSwapV4Position,
  removeSushiSwapV4LiquidityCallParameters,
} from 'sushi/evm'
import { useV4PositionTransaction } from './use-v4-position-transaction'

/** The liquidity removing `percentage` (a whole number string) takes. */
function getRemovedLiquidity(
  position: SushiSwapV4Position,
  percentage: string,
): bigint {
  return (position.liquidity * BigInt(+percentage || 0)) / 100n
}

interface V4RemoveLiquidityWidgetProps {
  chainId: SushiSwapV4ChainId
  tokenId: bigint
  position: SushiSwapV4Position | undefined
  /** Fully removed, or burned; undefined positions are still loading. */
  closed: boolean
  /** The pool's currencies, as "A/B", for the toasts. */
  pair: string
  /** Uncollected fees, which any liquidity change collects in full. */
  fees: readonly [Amount<EvmCurrency>, Amount<EvmCurrency>] | undefined
  /** The index could not give the fees; the removal still collects them. */
  feesUnavailable: boolean
  isOwner: boolean
}

export function V4RemoveLiquidityWidget({
  chainId,
  tokenId,
  position,
  closed,
  pair,
  fees,
  feesUnavailable,
  isOwner,
}: V4RemoveLiquidityWidgetProps): ReactElement {
  const [value, setValue] = useState('0')
  const debouncedValue = useDebounce(value, 300)

  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.RemoveLiquidity,
  )
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.RemoveLiquidity,
    chainId,
  })

  const removeAll = debouncedValue === '100'
  // A share of a tiny position can round to no liquidity, which the SDK rejects
  const tooSmall = Boolean(
    position && +value > 0 && getRemovedLiquidity(position, value) === 0n,
  )

  const call = useMemo(() => {
    // Only the owner's call can succeed, so only it is simulated
    if (
      !isOwner ||
      !position ||
      !deadline ||
      getRemovedLiquidity(position, debouncedValue) === 0n
    )
      return undefined
    return removeSushiSwapV4LiquidityCallParameters({
      position,
      tokenId,
      liquidityPercentage: new Percent({
        numerator: +debouncedValue,
        denominator: 100,
      }),
      slippageTolerance,
      deadline,
      // Removing everything also burns the empty position token
      burnToken: removeAll,
    })
  }, [
    isOwner,
    position,
    deadline,
    debouncedValue,
    tokenId,
    slippageTolerance,
    removeAll,
  ])

  const { send, isPending, isSimulationError, hash, status } =
    useV4PositionTransaction({
      chainId,
      tokenId,
      call,
      toast: {
        type: 'burn',
        pending: `Removing liquidity from the ${pair} pool`,
        completed: `Removed liquidity from the ${pair} pool`,
        failed: 'Something went wrong when removing liquidity',
      },
      location: 'V4RemoveLiquidityWidget',
    })

  const removed = useMemo(
    () => [
      position?.amount0.mul(BigInt(value)).div(100n),
      position?.amount1.mul(BigInt(value)).div(100n),
    ],
    [position, value],
  )

  return (
    <DialogProvider>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div
              className={classNames(closed && 'opacity-40 pointer-events-none')}
            >
              <CardContent>
                <CardGroup>
                  <div className="p-3 pb-2 space-y-2 overflow-hidden bg-white rounded-xl dark:bg-secondary border border-accent">
                    <div className="flex justify-between gap-4">
                      <h1 className="py-1 text-3xl text-gray-900 dark:text-slate-50">
                        {value}%
                      </h1>
                      <div className="flex items-center gap-2">
                        {['25', '50', '75', '100'].map((option) => (
                          <Button
                            key={option}
                            variant={value === option ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => setValue(option)}
                            testId={`liquidity-${option === '100' ? 'max' : option}`}
                          >
                            {option === '100' ? 'Max' : `${option}%`}
                          </Button>
                        ))}
                        <SettingsOverlay
                          options={{
                            slippageTolerance: {
                              storageKey:
                                SlippageToleranceStorageKey.RemoveLiquidity,
                              title: 'Remove Liquidity Slippage',
                            },
                            transactionDeadline: {
                              storageKey: TTLStorageKey.RemoveLiquidity,
                              defaultValue: getDefaultTTL(chainId).toString(),
                            },
                          }}
                          modules={[
                            SettingsModule.SlippageTolerance,
                            SettingsModule.TransactionDeadline,
                          ]}
                        >
                          <IconButton
                            size="sm"
                            name="Settings"
                            icon={Cog6ToothIcon}
                            variant="secondary"
                            className="!rounded-xl"
                          />
                        </SettingsOverlay>
                      </div>
                    </div>
                    <div className="px-1 pt-2 pb-3">
                      <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        type="range"
                        min="1"
                        max="100"
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </CardGroup>
                <Card variant="outline" className="space-y-6 p-6">
                  <CardGroup>
                    <CardLabel>{"You'll"} receive</CardLabel>
                    <CardCurrencyAmountItem
                      unwrap={false}
                      amount={removed[0]}
                    />
                    <CardCurrencyAmountItem
                      unwrap={false}
                      amount={removed[1]}
                    />
                  </CardGroup>
                  <CardGroup>
                    <CardLabel>
                      {"You'll"} also collect all uncollected fees
                    </CardLabel>
                    {feesUnavailable ? (
                      <p className="text-sm text-muted-foreground">
                        Their amounts could not be loaded.
                      </p>
                    ) : (
                      <>
                        <CardCurrencyAmountItem
                          unwrap={false}
                          amount={fees?.[0]}
                        />
                        <CardCurrencyAmountItem
                          unwrap={false}
                          amount={fees?.[1]}
                        />
                      </>
                    )}
                  </CardGroup>
                </Card>
              </CardContent>
              <CardFooter>
                <Checker.Guard
                  guardWhen={closed}
                  guardText="Position already closed"
                >
                  <Checker.Connect fullWidth>
                    <Checker.Network fullWidth chainId={chainId}>
                      <Checker.Guard
                        guardWhen={!isOwner}
                        guardText="Not the position owner"
                      >
                        <DialogTrigger asChild>
                          <Button
                            fullWidth
                            size="xl"
                            disabled={+value === 0 || tooSmall}
                            testId="remove-liquidity"
                          >
                            {+value === 0
                              ? 'Enter Amount'
                              : tooSmall
                                ? 'Amount too small'
                                : 'Remove'}
                          </Button>
                        </DialogTrigger>
                      </Checker.Guard>
                    </Checker.Network>
                  </Checker.Connect>
                </Checker.Guard>
              </CardFooter>
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove {value}% liquidity</DialogTitle>
                <DialogDescription>{pair}</DialogDescription>
              </DialogHeader>
              <List className="!pt-0">
                <List.Control>
                  {[...removed, ...(fees ?? [])].map((amount, i) =>
                    amount ? (
                      <List.KeyValue
                        key={`${amount.currency.id}-${i}`}
                        flex
                        title={i < 2 ? 'Liquidity' : 'Fees'}
                      >
                        {amount.toSignificant(6)} {amount.currency.symbol}
                      </List.KeyValue>
                    ) : null,
                  )}
                  <List.KeyValue flex title="Slippage">
                    {slippageTolerance.toPercentString()}
                  </List.KeyValue>
                  {feesUnavailable ? (
                    <List.KeyValue flex title="Fees">
                      All uncollected
                    </List.KeyValue>
                  ) : null}
                  {removeAll ? (
                    <List.KeyValue flex title="Position token">
                      Burned
                    </List.KeyValue>
                  ) : null}
                </List.Control>
              </List>
              <DialogFooter>
                <Button
                  size="xl"
                  fullWidth
                  // The call follows the debounced percentage
                  loading={!send || isPending || value !== debouncedValue}
                  disabled={isSimulationError}
                  onClick={() =>
                    // Reset once the dialog has moved on to the confirmation
                    send?.(() => {
                      confirm()
                      setValue('0')
                    })
                  }
                  testId="confirm-remove-liquidity"
                >
                  {isSimulationError ? (
                    'Shoot! Something went wrong :('
                  ) : isPending ? (
                    <Dots>Confirm Remove</Dots>
                  ) : (
                    'Remove Liquidity'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogConfirm
        chainId={chainId}
        status={status}
        testId="remove-v4-liquidity-confirmation-modal"
        successMessage={`You successfully removed liquidity from the ${pair} pool`}
        txHash={hash}
      />
    </DialogProvider>
  )
}
