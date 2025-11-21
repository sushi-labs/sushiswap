import { SkeletonText, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { formatUnits } from '~tron/_common/lib/utils/formatters'

type TokenBalanceDisplayProps = {
  amount: number
  isLoading: boolean
  decimals: number
  maxAmount?: () => void
  type: 'input' | 'output'
}

export const TokenBalanceDisplay = ({
  amount,
  isLoading,
  decimals,
  maxAmount,
  type,
}: TokenBalanceDisplayProps) => {
  const balanceStr = useMemo(
    () => (amount ? formatUnits(amount, decimals, 4) : '0'),
    [amount, decimals],
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
      onClick={maxAmount}
      className={classNames(
        type === 'input'
          ? 'text-skyblue hover:text-skyblue-600 active:text-skyblue-700'
          : 'text-gray-500 dark:text-slate-500',
        `text-sm font-medium flex gap-1 items-center rounded-md`,
      )}
    >
      Balance: {balanceStr}
    </button>
  )
}
