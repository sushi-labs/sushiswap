'use client'

import { Button, FormSection, Label, Message, TextField } from '@sushiswap/ui'
import { type ReactElement, useState } from 'react'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import {
  getGasBalanceReserve,
  getSpendableNativeBalance,
} from 'src/lib/wagmi/components/web3-input/currency/native-balance-reserve'
import { Amount } from 'sushi'
import {
  StellarChainId,
  type StellarContractAddress,
  type StellarToken,
} from 'sushi/stellar'
import { formatUnits } from 'viem'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useGetPool } from '~stellar/_common/lib/hooks/factory/use-get-pool'
import { usePoolInfo } from '~stellar/_common/lib/hooks/pool/use-pool-info'
import { usePoolInitialized } from '~stellar/_common/lib/hooks/pool/use-pool-initialized'
import { useTickRangeSelector } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import {
  type LiquidityField,
  calculateDependentAmount,
  getLiquidityAmounts,
  parseStartingPrice,
  poolPrice,
} from '~stellar/_common/lib/utils/liquidity-amounts'
import { getSqrtRatioAtTick } from '~stellar/_common/lib/utils/ticks'
import { TickRangeSelector } from '~stellar/_common/ui/tick-range-selector/tick-range-selector'
import { PoolSubmit } from './pool-submit'

interface PoolPositionFormProps {
  token0: StellarToken
  token1: StellarToken
  fee: number
  onBusyChange(busy: boolean): void
}

export function PoolPositionForm({
  token0,
  token1,
  fee,
  onBusyChange,
}: PoolPositionFormProps): ReactElement {
  const [createdPool, setCreatedPool] = useState<StellarContractAddress>()
  const [inverted, setInverted] = useState(false)
  const [priceInput, setPriceInput] = useState({ value: '', inverted: false })
  const [input, setInput] = useState<{ field: LiquidityField; value: string }>({
    field: 'token0',
    value: '',
  })
  const pool = useGetPool({
    tokenA: token0.address,
    tokenB: token1.address,
    fee,
  })
  const address = createdPool ?? pool.data
  const initialized = usePoolInitialized(address)
  const info = usePoolInfo(
    initialized.data === true && address ? address : null,
  )
  const needsInitialization =
    (pool.isSuccess && !address) || initialized.data === false
  const proposedPrice = parseStartingPrice(
    token0,
    token1,
    priceInput.value,
    priceInput.inverted,
  )
  const sqrtPrice =
    initialized.data === true
      ? info.data?.sqrtPriceX96
      : needsInitialization
        ? proposedPrice
        : undefined
  const priceError =
    (!createdPool && pool.isError) ||
    (Boolean(address) && initialized.isError) ||
    (initialized.data === true && info.isError)
  const loading =
    (!createdPool && pool.isPending) ||
    (Boolean(address) && initialized.isPending) ||
    (initialized.data === true && info.isPending)
  const range = useTickRangeSelector(fee, sqrtPrice)
  const { tickLower, tickUpper, isTickRangeValid } = range
  const { data: balance0 } = useAmountBalance(token0)
  const { data: balance1 } = useAmountBalance(token1)
  const below =
    sqrtPrice !== undefined && sqrtPrice <= getSqrtRatioAtTick(tickLower)
  const above =
    sqrtPrice !== undefined && sqrtPrice >= getSqrtRatioAtTick(tickUpper)
  const quote =
    sqrtPrice !== undefined && isTickRangeValid
      ? calculateDependentAmount(
          input.value,
          input.field,
          input.field === 'token0' ? token0.decimals : token1.decimals,
          input.field === 'token0' ? token1.decimals : token0.decimals,
          sqrtPrice,
          tickLower,
          tickUpper,
        )
      : undefined
  const amount0 = above
    ? '0'
    : input.field === 'token0'
      ? input.value
      : (quote?.amount ?? '')
  const amount1 = below
    ? '0'
    : input.field === 'token1'
      ? input.value
      : (quote?.amount ?? '')
  const amounts = [
    Amount.tryFromHuman(token0, amount0),
    Amount.tryFromHuman(token1, amount1),
  ].filter((amount): amount is Amount<StellarToken> =>
    Boolean(amount && amount.amount > 0n),
  )
  const reason = priceError
    ? 'Pool state unavailable'
    : loading
      ? 'Checking pool'
      : sqrtPrice === undefined
        ? 'Enter a valid starting price'
        : !isTickRangeValid
          ? 'Invalid price range'
          : !input.value
            ? 'Enter an amount'
            : (quote?.error ??
              (quote?.status === 'idle' || !quote || amounts.length === 0
                ? 'Enter an amount'
                : undefined))
  const displayedStartPrice =
    priceInput.inverted === inverted
      ? priceInput.value
      : proposedPrice
        ? poolPrice(token0, token1, proposedPrice, inverted).toSignificant(12)
        : ''

  function setMaximum(field: LiquidityField): void {
    if (sqrtPrice === undefined || !isTickRangeValid || !balance0 || !balance1)
      return
    const maximum = getLiquidityAmounts(
      sqrtPrice,
      tickLower,
      tickUpper,
      getSpendableNativeBalance(balance0.amount, getGasBalanceReserve(token0)),
      getSpendableNativeBalance(balance1.amount, getGasBalanceReserve(token1)),
    )
    setInput({
      field,
      value: formatUnits(
        field === 'token0' ? maximum.amount0 : maximum.amount1,
        field === 'token0' ? token0.decimals : token1.decimals,
      ),
    })
  }

  return (
    <>
      <FormSection
        title="Range"
        description="Choose the price range in which your liquidity earns fees."
      >
        <div className="space-y-5">
          <div
            className="flex justify-end gap-2"
            role="group"
            aria-label="Price currency"
          >
            <Button
              type="button"
              size="sm"
              variant={inverted ? 'secondary' : 'default'}
              aria-pressed={!inverted}
              onClick={() => setInverted(false)}
            >
              {token1.symbol} per {token0.symbol}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={inverted ? 'default' : 'secondary'}
              aria-pressed={inverted}
              onClick={() => setInverted(true)}
            >
              {token0.symbol} per {token1.symbol}
            </Button>
          </div>
          {priceError ? (
            <Message variant="destructive" size="sm">
              Unable to load this pool.{' '}
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  void pool.refetch()
                  if (address) void initialized.refetch()
                  if (initialized.data) void info.refetch()
                }}
              >
                Retry
              </Button>
            </Message>
          ) : loading ? (
            <p role="status">Checking pool…</p>
          ) : needsInitialization ? (
            <div className="space-y-3">
              <Message variant="muted" size="sm">
                Set a starting price to initialize this pool. Initialization
                requires a separate transaction before adding liquidity.
              </Message>
              <Label htmlFor="stellar-start-price">
                Starting price ({inverted ? token0.symbol : token1.symbol} per{' '}
                {inverted ? token1.symbol : token0.symbol})
              </Label>
              <TextField
                id="stellar-start-price"
                aria-label="Starting price"
                type="number"
                value={displayedStartPrice}
                onValueChange={(value) => setPriceInput({ value, inverted })}
                placeholder="0.0"
              />
            </div>
          ) : sqrtPrice !== undefined ? (
            <p className="text-sm text-muted-foreground">
              Current price:{' '}
              {poolPrice(token0, token1, sqrtPrice, inverted).toSignificant(8)}{' '}
              {inverted ? token0.symbol : token1.symbol} per{' '}
              {inverted ? token1.symbol : token0.symbol}
            </p>
          ) : null}
          <fieldset
            disabled={loading || priceError || sqrtPrice === undefined}
            className="min-w-0"
          >
            <TickRangeSelector
              params={range}
              token0={token0}
              token1={token1}
              inverted={inverted}
              variant="cards"
            />
          </fieldset>
        </div>
      </FormSection>
      <FormSection
        title="Liquidity"
        description="Enter either token amount. The paired amount is calculated from your price range."
      >
        <div className="space-y-4">
          {initialized.data === true && (
            <Message variant="muted" size="sm">
              This pool already exists. Your liquidity will be added to it.
            </Message>
          )}
          {(below || above) && (
            <Message variant="muted" size="sm">
              Only {below ? token0.symbol : token1.symbol} is needed. This
              position will not earn fees until the price enters your range.
            </Message>
          )}
          {(
            [
              {
                field: 'token0',
                token: token0,
                value: amount0,
                disabled: above,
              },
              {
                field: 'token1',
                token: token1,
                value: amount1,
                disabled: below,
              },
            ] as const
          ).map(({ field, token, value, disabled }) => (
            <div key={field}>
              <CurrencyInput
                chainId={StellarChainId.STELLAR}
                id={`stellar-add-liquidity-${field}`}
                label={`${token.symbol} deposit`}
                type="INPUT"
                className="rounded-xl border border-accent bg-white p-3 dark:bg-secondary"
                currency={token}
                value={value}
                onChange={(value) => setInput({ field, value })}
                disabled={
                  disabled || sqrtPrice === undefined || loading || priceError
                }
                disableMaxButton
              />
              <Button
                type="button"
                variant="link"
                size="sm"
                aria-label={`Use maximum ${token.symbol}`}
                disabled={
                  disabled ||
                  !balance0 ||
                  !balance1 ||
                  sqrtPrice === undefined ||
                  !isTickRangeValid
                }
                onClick={() => setMaximum(field)}
              >
                Max {token.symbol}
              </Button>
            </div>
          ))}
          {quote?.error && (
            <p role="alert" className="text-sm text-red">
              {quote.error}
            </p>
          )}
          <PoolSubmit
            token0={token0}
            token1={token1}
            fee={fee}
            poolAddress={address ?? undefined}
            needsInitialization={needsInitialization}
            sqrtPriceX96={sqrtPrice}
            tickLower={tickLower}
            tickUpper={tickUpper}
            amount0={amount0}
            amount1={amount1}
            amounts={amounts}
            disabledReason={reason}
            onCreated={setCreatedPool}
            onBusyChange={onBusyChange}
            onSuccess={() => setInput({ field: input.field, value: '' })}
          />
        </div>
      </FormSection>
    </>
  )
}
