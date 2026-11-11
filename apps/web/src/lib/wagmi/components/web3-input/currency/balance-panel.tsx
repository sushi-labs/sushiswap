import { SkeletonText, classNames } from '@sushiswap/ui'
import { useCallback } from 'react'
import { Amount } from 'sushi'

import { useIsMounted } from '@sushiswap/hooks'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'
import type { CurrencyInputProps } from './currency-input'
import {
  getGasBalanceReserve,
  getSpendableNativeBalance,
} from './native-balance-reserve'

type BalancePanel<TChainId extends BalanceChainId> = Pick<
  CurrencyInputProps<TChainId>,
  'chainId' | 'onChange' | 'onMax' | 'currency' | 'disableMaxButton' | 'loading'
> & {
  id?: string
  error?: boolean
  account: string | undefined
  balance: Amount<CurrencyFor<TChainId>> | null | undefined
  type: 'INPUT' | 'OUTPUT'
}

export function BalancePanel<TChainId extends BalanceChainId>({
  id,
  balance,
  currency,
  onChange,
  onMax,
  disableMaxButton,
  loading,
  error = false,
  type,
}: BalancePanel<TChainId>) {
  const isMounted = useIsMounted()

  const [big, portion] = (
    balance ? `${balance?.toSignificant(6)}` : '0.00'
  ).split('.')

  const onClick = useCallback(() => {
    if (onMax) {
      onMax()
      return
    }
    if (!onChange || !balance?.gt(0n)) return

    // Leave gas funds in the selected currency's base units, including Arc's
    // ERC-20 USDC interface, which shares its balance with native USDC.
    const reserve = getGasBalanceReserve(balance.currency)
    if (reserve > 0n) {
      const spendableBalance = new Amount(
        balance.currency,
        getSpendableNativeBalance(balance.amount, reserve),
      )
      onChange(spendableBalance.toString())
      return
    }

    onChange(balance.toString())
  }, [balance, onChange, onMax])

  if (loading || !isMounted) {
    return (
      <div className="w-24 h-6 flex items-center">
        <SkeletonText fontSize="xs" className="w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <span role="status" className="text-sm text-muted-foreground">
        Balance unavailable
      </span>
    )
  }

  return (
    <button
      id={`${id}-balance-button`}
      testdata-id={`${id}-balance-button`}
      type="button"
      aria-label={`Use maximum ${currency?.symbol ?? ''}`.trim()}
      // variant="ghost"
      onClick={onClick}
      className={classNames(
        type === 'INPUT'
          ? 'text-pink hover:text-pink-600 active:text-pink-700 hover:dark:text-slate-300'
          : 'text-muted-foreground',
        'font-medium flex gap-1.5 items-center py-1 rounded-md text-xs',
      )}
      disabled={disableMaxButton}
    >
      Balance:
      <span>
        {big}.<span>{portion ?? '00'}</span>
      </span>
    </button>
  )
}
