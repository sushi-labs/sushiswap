import { SkeletonText, classNames } from '@sushiswap/ui'
import { WalletIcon } from '@sushiswap/ui/icons/WalletIcon'
import React, { type FC, useMemo } from 'react'
import { Fraction } from 'sushi'

interface CurrencyInputBalancePanel {
  coinData: number
  isLoading: boolean
  decimals: number
  onClick?: () => void
  type: 'INPUT' | 'OUTPUT'
}

export const CurrencyInputBalancePanel: FC<CurrencyInputBalancePanel> = ({
  coinData,
  isLoading,
  decimals,
  onClick,
  type,
}) => {
  const balanceStr = useMemo(
    () =>
      (coinData
        ? `${new Fraction({ numerator: coinData, denominator: 10 ** decimals }).toSignificant(6)}`
        : '0.00'
      ).split('.'),
    [coinData, decimals],
  )

  if (isLoading) {
    return (
      <div className="w-[60px] flex items-center">
        <SkeletonText fontSize="sm" className="w-full" />
      </div>
    )
  }

  return (
    <button
      id="swap-from-balance-button"
      testdata-id="swap-from-balance-button"
      type="button"
      onClick={onClick}
      className={classNames(
        type === 'INPUT'
          ? 'text-skyblue hover:text-skyblue-600 active:text-skyblue-700'
          : 'text-gray-500 dark:text-slate-500',
        'text-sm font-medium flex gap-1 items-center rounded-md',
      )}
    >
      Balance: {balanceStr}
    </button>
  )
}
