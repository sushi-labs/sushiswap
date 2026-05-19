import { SkeletonText, classNames } from '@sushiswap/ui'
import { WalletIcon } from '@sushiswap/ui/icons/WalletIcon'
import { type FC, memo, useCallback } from 'react'
import { Amount } from 'sushi'
import { EvmNative, isEvmChainId } from 'sushi/evm'
import { isStellarChainId } from 'sushi/stellar'

import { useIsMounted } from '@sushiswap/hooks'
import { SvmNative } from 'sushi/svm'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'
import { contractAddresses } from '~stellar/_common/lib/soroban/contracts'
import type { CurrencyInputProps } from './currency-input'

type BalancePanel<TChainId extends BalanceChainId> = Pick<
  CurrencyInputProps<TChainId>,
  'chainId' | 'onChange' | 'currency' | 'disableMaxButton' | 'loading'
> & {
  id?: string
  account: string | undefined
  balance: Amount<CurrencyFor<TChainId>> | null | undefined
  type: 'INPUT' | 'OUTPUT'
}

const MIN_NATIVE_CURRENCY_FOR_GAS = 10n ** 16n // .01 ETH
// Stellar uses 7 decimals; reserve 1 XLM to cover the base account reserve
// and ample buffer for txn fees + new trustlines.
const MIN_XLM_FOR_RESERVE = 10n ** 7n // 1 XLM

export function BalancePanel<TChainId extends BalanceChainId>({
  id,
  balance,
  onChange,
  disableMaxButton,
  loading,
  type,
}: BalancePanel<TChainId>) {
  const isMounted = useIsMounted()

  const [big, portion] = (
    balance ? `${balance?.toSignificant(6)}` : '0.00'
  ).split('.')

  const onClick = useCallback(() => {
    if (!onChange || !balance?.gt(0n)) return

    // EVM/SVM native carve-out: subtract a small gas reserve.
    if (
      balance.currency.type === 'native' &&
      balance.gt(MIN_NATIVE_CURRENCY_FOR_GAS)
    ) {
      const reserve = new Amount(
        isEvmChainId(balance.currency.chainId)
          ? EvmNative.fromChainId(balance.currency.chainId)
          : SvmNative.fromChainId(balance.currency.chainId),
        MIN_NATIVE_CURRENCY_FOR_GAS,
      )
      onChange(balance.sub(reserve).toString())
      return
    }

    // Stellar's XLM is modeled as a regular token (no `native` discriminant),
    // so guard on the contract address. Reserve covers Stellar's base
    // account reserve + fees so the wallet stays usable after a max swap.
    if (
      isStellarChainId(balance.currency.chainId) &&
      'address' in balance.currency &&
      balance.currency.address === contractAddresses.TOKENS.XLM &&
      balance.gt(MIN_XLM_FOR_RESERVE)
    ) {
      const reserve = new Amount(balance.currency, MIN_XLM_FOR_RESERVE)
      onChange(balance.sub(reserve).toString())
      return
    }

    onChange(balance.toString())
  }, [balance, onChange])

  if (loading || !isMounted) {
    return (
      <div className="w-[60px] flex items-center">
        <SkeletonText fontSize="lg" className="w-full" />
      </div>
    )
  }

  return (
    <button
      id={`${id}-balance-button`}
      testdata-id={`${id}-balance-button`}
      type="button"
      // variant="ghost"
      onClick={onClick}
      className={classNames(
        type === 'INPUT'
          ? 'text-blue hover:text-blue-600 active:text-blue-700 hover:dark:text-slate-300'
          : 'text-gray-500 dark:text-slate-500',
        'font-medium flex gap-1.5 items-center py-1 dark:text-slate-400 px-2 rounded-md',
      )}
      disabled={disableMaxButton}
    >
      <WalletIcon width={18} height={18} />
      <span className="text-lg">
        {big}.<span className="text-sm font-semibold">{portion ?? '00'}</span>
      </span>
    </button>
  )
}
