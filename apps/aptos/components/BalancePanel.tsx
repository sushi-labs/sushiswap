import { classNames } from '@sushiswap/ui'
import { WalletIcon } from '@sushiswap/ui/future/components/icons'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import React, { useMemo } from 'react'
import { Fraction } from '@sushiswap/math'

interface Props {
  coinData: number
  isLoading: boolean
  decimals: number
  onClick?: () => void
  type: 'INPUT' | 'OUTPUT'
}

export const BalancePanel = ({ coinData, isLoading, decimals, onClick, type }: Props) => {
  const [big, portion] = useMemo(
    () =>
      (coinData
        ? `${new Fraction(coinData, 10 ** decimals).toSignificant(6)}`
        : '0.00'
      ).split('.'),
    [coinData, decimals],
  )

  return (
    <button
      id="swap-from-balance-button"
      testdata-id="swap-from-balance-button"
      type="button"
      onClick={onClick}
      className={classNames(
        type === 'INPUT'
          ? 'text-blue hover:text-blue-600 active:text-blue-700 hover:dark:text-slate-300'
          : 'text-gray-500 dark:text-slate-500',
        `font-medium flex gap-1.5 items-center py-1 dark:text-slate-400 px-2 rounded-md`
      )}
    >
      <WalletIcon width={18} height={18} />
      {isLoading ? (
        <div className="w-[60px] flex items-center">
          <Skeleton.Text fontSize="text-lg" className="w-full" />
        </div>
      ) : (
        <span className="text-lg">
          {big}.<span className="text-sm font-semibold">{portion ?? '00'}</span>
        </span>
      )}
    </button>
  )
}
