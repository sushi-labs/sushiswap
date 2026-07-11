'use client'

import { Button, FormSection, TextField } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import { useAmountBalance } from 'src/app/(networks)/(evm)/_common/ui/balance-provider/use-balance'
import { useAccount } from 'src/lib/wallet'
import type { StellarContractAddress, StellarToken } from 'sushi/stellar'
import { formatUnits } from 'viem'
import type { useCalculatePairedAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-paired-amount'
import { useMaxPairedAmount } from '~stellar/_common/lib/hooks/pool/use-max-paired-amount'
import { usePoolBalances } from '~stellar/_common/lib/hooks/pool/use-pool-balances'
import type { TickRangeSelectorState } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import type { PoolInfo } from '~stellar/_common/lib/types/pool.type'
import { TickRangeSelector } from '~stellar/_common/ui/TickRangeSelector/TickRangeSelector'

type PairedAmountData = ReturnType<typeof useCalculatePairedAmount>['data']

interface StellarPoolLiquidityWidgetProps {
  orderedToken0: StellarToken | undefined
  orderedToken1: StellarToken | undefined
  orderedToken0Amount: string
  orderedToken1Amount: string
  setOrderedToken0Amount(value: string): void
  setManualOrderedToken1Amount(value: string): void
  existingPoolAddress: StellarContractAddress | null | undefined
  poolInitialized: boolean | undefined
  poolInfo: PoolInfo | null | undefined
  tickRangeSelectorState: TickRangeSelectorState
  pairedAmountData: PairedAmountData
}

export function StellarPoolLiquidityWidget({
  orderedToken0,
  orderedToken1,
  orderedToken0Amount,
  orderedToken1Amount,
  setOrderedToken0Amount,
  setManualOrderedToken1Amount,
  existingPoolAddress,
  poolInitialized,
  poolInfo,
  tickRangeSelectorState,
  pairedAmountData,
}: StellarPoolLiquidityWidgetProps): ReactElement {
  const connectedAddress = useAccount('stellar')
  const { tickLower, tickUpper } = tickRangeSelectorState
  const { data: orderedToken0Balance } = useAmountBalance(orderedToken0)
  const { data: orderedToken1Balance } = useAmountBalance(orderedToken1)
  const { data: poolBalanceData } = usePoolBalances(
    existingPoolAddress || null,
    connectedAddress,
  )
  const { data: maxPairedAmountData } = useMaxPairedAmount(
    existingPoolAddress || null,
    poolBalanceData?.token0.amount || '0',
    poolBalanceData?.token1.amount || '0',
    tickLower,
    tickUpper,
    poolInfo?.token0.decimals ?? 7,
    poolInfo?.token1.decimals ?? 7,
  )
  const maxOrderedToken0Amount =
    existingPoolAddress && poolInitialized === true
      ? BigInt(maxPairedAmountData?.maxToken0Amount ?? '0')
      : (orderedToken0Balance?.amount ?? 0n)
  const maxOrderedToken1Amount =
    existingPoolAddress && poolInitialized === true
      ? BigInt(maxPairedAmountData?.maxToken1Amount ?? '0')
      : (orderedToken1Balance?.amount ?? 0n)
  const pairedAmountStatus = pairedAmountData?.status ?? 'idle'
  const hasOrderedToken0Amount = Boolean(
    orderedToken0Amount &&
      orderedToken0Amount !== '0' &&
      Number.parseFloat(orderedToken0Amount) > 0,
  )
  const hasValidAmounts = Boolean(
    existingPoolAddress && poolInitialized === true
      ? hasOrderedToken0Amount
      : hasOrderedToken0Amount &&
          orderedToken1Amount &&
          Number.parseFloat(orderedToken1Amount) > 0,
  )

  function handleOrderedToken0AmountChange(value: string): void {
    if (value === '') {
      setOrderedToken0Amount('')
      return
    }

    if (
      !orderedToken0 ||
      (existingPoolAddress && poolInitialized === true && !maxPairedAmountData)
    ) {
      return
    }

    const rawAmountValue = BigInt(
      Math.floor(Number.parseFloat(value) * 10 ** orderedToken0.decimals),
    )

    if (rawAmountValue >= maxOrderedToken0Amount) {
      setOrderedToken0Amount(
        formatUnits(maxOrderedToken0Amount, orderedToken0.decimals),
      )
    } else {
      setOrderedToken0Amount(value)
    }
  }

  function handleOrderedToken1AmountChange(value: string): void {
    if (value === '') {
      setManualOrderedToken1Amount('')
      return
    }

    if (
      !orderedToken1 ||
      (existingPoolAddress && poolInitialized === true && !maxPairedAmountData)
    ) {
      return
    }

    const rawAmountValue = BigInt(
      Math.floor(Number.parseFloat(value) * 10 ** orderedToken1.decimals),
    )

    if (rawAmountValue >= maxOrderedToken1Amount) {
      setManualOrderedToken1Amount(
        formatUnits(maxOrderedToken1Amount, orderedToken1.decimals),
      )
    } else {
      setManualOrderedToken1Amount(value)
    }
  }

  return (
    <FormSection
      title="Initial Liquidity"
      description={
        existingPoolAddress && poolInitialized === true
          ? `Enter ${orderedToken0?.symbol || 'token0'} amount - ${orderedToken1?.symbol || 'token1'} amount will be calculated automatically.`
          : existingPoolAddress && poolInitialized === false
            ? 'This pool exists but is not initialized. Enter both token amounts to set the initial price ratio.'
            : 'Add liquidity to your pool. Both amounts are required.'
      }
    >
      <section className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            {orderedToken0 && (
              <span className="text-sm font-medium">
                {orderedToken0.symbol}
              </span>
            )}
            {orderedToken0Balance !== undefined && (
              <span className="text-xs text-muted-foreground">
                {orderedToken0Balance.toString()}
              </span>
            )}
          </div>
          <div className="flex flex-row gap-2">
            <TextField
              type="number"
              label={orderedToken0?.symbol || 'Token 1'}
              placeholder="0.0"
              value={orderedToken0Amount}
              onValueChange={handleOrderedToken0AmountChange}
              required
            />
            <Button
              type="button"
              size="sm"
              variant={
                orderedToken0 &&
                formatUnits(maxOrderedToken0Amount, orderedToken0.decimals) ===
                  orderedToken0Amount
                  ? 'default'
                  : 'secondary'
              }
              disabled={!orderedToken0}
              onClick={() => {
                if (!orderedToken0) {
                  return
                }

                setOrderedToken0Amount(
                  formatUnits(maxOrderedToken0Amount, orderedToken0.decimals),
                )
              }}
              className="px-2"
            >
              Max
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center -my-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <span className="text-lg">+</span>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between items-center">
              {orderedToken1 && (
                <span className="text-sm font-medium">
                  {orderedToken1.symbol}
                </span>
              )}
              {orderedToken1Balance !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {orderedToken1Balance.toString()}
                </span>
              )}
            </div>
            <div className="flex flex-row gap-2">
              <TextField
                type={
                  existingPoolAddress && poolInitialized === true
                    ? 'text'
                    : 'number'
                }
                label={orderedToken1?.symbol || 'Token 2'}
                placeholder={
                  existingPoolAddress && poolInitialized === true
                    ? 'Auto-calculated'
                    : '0.0'
                }
                value={orderedToken1Amount}
                onValueChange={
                  existingPoolAddress && poolInitialized === true
                    ? undefined
                    : handleOrderedToken1AmountChange
                }
                disabled={!!existingPoolAddress && poolInitialized === true}
                required={!existingPoolAddress || poolInitialized === false}
              />
              {(!existingPoolAddress || poolInitialized === false) && (
                <Button
                  type="button"
                  size="sm"
                  variant={
                    orderedToken1 &&
                    formatUnits(
                      maxOrderedToken1Amount,
                      orderedToken1.decimals,
                    ) === orderedToken1Amount
                      ? 'default'
                      : 'secondary'
                  }
                  disabled={!orderedToken1}
                  onClick={() => {
                    if (!orderedToken1) {
                      return
                    }

                    setManualOrderedToken1Amount(
                      formatUnits(
                        maxOrderedToken1Amount,
                        orderedToken1.decimals,
                      ),
                    )
                  }}
                  className="px-2"
                >
                  Max
                </Button>
              )}
            </div>
          </div>
          {existingPoolAddress &&
            poolInitialized === true &&
            pairedAmountData?.error &&
            ((pairedAmountStatus === 'error' && (
              <p className="text-xs text-red-600 dark:text-red-400">
                {pairedAmountData.error}
              </p>
            )) || (
              <p className="text-xs text-muted-foreground">
                {pairedAmountData.error}
              </p>
            ))}
        </div>
        <TickRangeSelector
          params={tickRangeSelectorState}
          token0={orderedToken0}
          token1={orderedToken1}
        />
      </section>

      {orderedToken0 && orderedToken1 && !hasValidAmounts && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {existingPoolAddress && poolInitialized === true
              ? `Enter ${orderedToken0.symbol} amount to add liquidity`
              : existingPoolAddress && poolInitialized === false
                ? 'Both token amounts are required to initialize the pool and add liquidity'
                : 'Both token amounts are required to create a pool'}
          </p>
        </div>
      )}
      {existingPoolAddress && poolInitialized === true && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">
            Pool already exists - liquidity will be added to existing pool
          </p>
        </div>
      )}
      {existingPoolAddress && poolInitialized === false && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Warning: Pool exists but is not initialized. Enter both token
            amounts to set the initial price, then add liquidity.
          </p>
        </div>
      )}
    </FormSection>
  )
}
