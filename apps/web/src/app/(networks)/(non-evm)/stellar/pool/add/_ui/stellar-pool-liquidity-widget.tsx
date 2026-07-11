'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import { FormSection, Message } from '@sushiswap/ui'
import type { ReactElement, ReactNode } from 'react'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/Currency'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import type { StellarContractAddress, StellarToken } from 'sushi/stellar'
import { formatUnits } from 'viem'
import type { useCalculateDependentAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-dependent-amount'
import { useMaxPairedAmount } from '~stellar/_common/lib/hooks/pool/use-max-paired-amount'
import { usePoolBalances } from '~stellar/_common/lib/hooks/pool/use-pool-balances'

type PairedAmountData = ReturnType<typeof useCalculateDependentAmount>['data']

interface StellarPoolLiquidityWidgetProps {
  token0: StellarToken | undefined
  token1: StellarToken | undefined
  token0Amount: string
  token1Amount: string
  existingPoolAddress: StellarContractAddress | null | undefined
  poolInitialized: boolean | undefined
  tickLower: number
  tickUpper: number
  pairedAmount: PairedAmountData
  children: ReactNode
  onToken0AmountChange(value: string): void
}

export function StellarPoolLiquidityWidget({
  token0,
  token1,
  token0Amount,
  token1Amount,
  existingPoolAddress,
  poolInitialized,
  tickLower,
  tickUpper,
  pairedAmount,
  children,
  onToken0AmountChange,
}: StellarPoolLiquidityWidgetProps): ReactElement {
  const connectedAddress = useAccount('stellar')
  const chainId = token0?.chainId ?? token1?.chainId
  const isInitializedPool = Boolean(
    existingPoolAddress && poolInitialized === true,
  )

  const { data: poolBalances } = usePoolBalances(
    existingPoolAddress || null,
    connectedAddress,
  )
  const { data: maximumAmounts } = useMaxPairedAmount(
    existingPoolAddress || null,
    poolBalances?.token0.amount || '0',
    poolBalances?.token1.amount || '0',
    tickLower,
    tickUpper,
    token0,
    token1,
  )

  function clampAmount(
    value: string,
    token: StellarToken | undefined,
    maximumRawAmount: string | undefined,
  ): string | undefined {
    if (value === '') {
      return ''
    }

    if (!token || (isInitializedPool && !maximumAmounts)) {
      return undefined
    }

    const rawAmount = Amount.tryFromHuman(token, value)?.amount
    if (rawAmount === undefined) {
      return undefined
    }

    const maximum = BigInt(maximumRawAmount ?? '0')
    return maximum > 0n && rawAmount >= maximum
      ? formatUnits(maximum, token.decimals)
      : value
  }

  function handleToken0AmountChange(value: string): void {
    const clamped = clampAmount(value, token0, maximumAmounts?.maxToken0Amount)
    if (clamped !== undefined) {
      onToken0AmountChange(clamped)
    }
  }

  return (
    <FormSection
      title="Liquidity"
      description={
        <span>
          Depending on your range, the supplied tokens for this position will
          not always be a 50:50 ratio.
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        {isInitializedPool ? (
          <Message size="sm" variant="muted" className="text-center">
            This pool already exists. Your liquidity will be added to it.
          </Message>
        ) : null}

        {chainId ? (
          <div className="flex flex-col gap-4">
            <CurrencyInput
              chainId={chainId}
              id="stellar-add-liquidity-token0"
              type="INPUT"
              className="rounded-xl border border-accent bg-white p-3 dark:bg-secondary"
              value={token0Amount}
              onChange={handleToken0AmountChange}
              currency={token0}
            />

            <div className="z-10 my-[-24px] flex items-center justify-center">
              <div className="rounded-full border border-accent bg-white p-1 dark:bg-slate-900">
                <PlusIcon
                  width={16}
                  height={16}
                  className="text-muted-foreground"
                />
              </div>
            </div>

            <CurrencyInput
              chainId={chainId}
              id="stellar-add-liquidity-token1"
              type="OUTPUT"
              className="rounded-xl border border-accent bg-white p-3 dark:bg-secondary"
              value={token1Amount}
              currency={token1}
              disabled
            />

            {pairedAmount?.error ? (
              <p
                className={
                  pairedAmount.status === 'error'
                    ? 'text-xs text-red-600 dark:text-red-400'
                    : 'text-xs text-muted-foreground'
                }
              >
                {pairedAmount.error}
              </p>
            ) : null}
          </div>
        ) : null}

        {children}
      </div>
    </FormSection>
  )
}
