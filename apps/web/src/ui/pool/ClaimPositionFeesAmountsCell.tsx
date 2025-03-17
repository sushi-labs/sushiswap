import { Currency } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import { type FC, useMemo } from 'react'
import { useTokenAmountDollarValues } from 'src/lib/hooks'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { Amount, type Type, unwrapToken } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import { FeesBreakdownPopover } from './FeesBreakdownPopover'

export const ClaimPositionFeesAmountsCell: FC<
  Row<{
    chainId: SushiSwapV3ChainId
    positions: ConcentratedLiquidityPositionWithV3Pool[]
  }>
> = ({ original }) => {
  const unclaimedFees = useMemo(() => {
    return original.positions.reduce((acc, position) => {
      return acc + position.position.unclaimedUSD
    }, 0)
  }, [original.positions])

  const aggregatedAmounts = useMemo(() => {
    const amounts = new Map<string, Amount<Type>>()

    original.positions.forEach((position) => {
      const { token0, token1 } = position.pool
      if (!token0 || !token1 || !position.fees) return

      const expectedToken0 = unwrapToken(token0)
      const expectedToken1 = unwrapToken(token1)

      const feeValue0 = Amount.fromRawAmount(expectedToken0, position.fees[0])
      const feeValue1 = Amount.fromRawAmount(expectedToken1, position.fees[1])

      if (feeValue0.greaterThan(0n)) {
        const existing = amounts.get(expectedToken0.id)
        amounts.set(
          expectedToken0.id,
          existing ? existing.add(feeValue0) : feeValue0,
        )
      }

      if (feeValue1.greaterThan(0n)) {
        const existing = amounts.get(expectedToken1.id)
        amounts.set(
          expectedToken1.id,
          existing ? existing.add(feeValue1) : feeValue1,
        )
      }
    })

    return Array.from(amounts.values())
  }, [original.positions])

  const feeValues = useTokenAmountDollarValues({
    chainId: original.chainId,
    amounts: aggregatedAmounts,
  })

  const feesByToken = useMemo(() => {
    return aggregatedAmounts.map((amount, i) => ({
      amount,
      usdValue: feeValues[i] ?? 0,
    }))
  }, [aggregatedAmounts, feeValues])

  const displayedFees = useMemo(() => feesByToken.slice(0, 3), [feesByToken])
  const remainingFees = Math.max(0, feesByToken.length - 3)

  return (
    <div className="flex gap-2 items-center w-full">
      <FeesBreakdownPopover amounts={feesByToken} totalUsd={unclaimedFees}>
        <Button variant="empty">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-gray-900 dark:text-slate-50 border-b border-dotted border-gray-400 dark:border-slate-500">
              {formatUSD(unclaimedFees)}
            </span>
            <div className="flex items-center">
              <Currency.IconList iconWidth={16} iconHeight={16}>
                {displayedFees.map(({ amount }) => (
                  <Currency.Icon
                    key={amount.currency.id}
                    currency={amount.currency}
                  />
                ))}
              </Currency.IconList>
              {remainingFees > 0 && (
                <span className="text-sm text-muted-foreground ml-0.5">
                  +{remainingFees}
                </span>
              )}
            </div>
          </div>
        </Button>
      </FeesBreakdownPopover>
    </div>
  )
}
