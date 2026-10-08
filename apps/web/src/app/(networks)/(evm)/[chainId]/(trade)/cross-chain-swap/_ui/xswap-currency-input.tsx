'use client'

import { classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { AdditionalCurrenciesProvider } from 'src/lib/wagmi/components/token-selector/additional-currencies-provider'
import { CurrencyInput } from 'src/lib/wagmi/components/web3-input/currency'
import type { CurrencyInputProps } from 'src/lib/wagmi/components/web3-input/currency'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'
import { useValueTransferCatalog } from './layerzero/hooks/use-value-transfer-catalog'

type XSwapCurrencyInputProps<
  TChainId extends BalanceChainId,
  TNetwork extends BalanceChainId = TChainId,
> = CurrencyInputProps<TChainId, TNetwork>

export function XSwapCurrencyInput<
  TChainId extends BalanceChainId,
  TNetwork extends BalanceChainId = TChainId,
>({ className, ...props }: XSwapCurrencyInputProps<TChainId, TNetwork>) {
  const catalog = useValueTransferCatalog()
  const additionalCurrencies = useMemo(
    () => catalog.entries.map(({ currency }) => currency),
    [catalog.entries],
  )
  return (
    <AdditionalCurrenciesProvider currencies={additionalCurrencies}>
      <CurrencyInput
        {...props}
        className={classNames(
          'border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl',
          className,
        )}
      />
    </AdditionalCurrenciesProvider>
  )
}
