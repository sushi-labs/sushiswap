'use client'

import { classNames } from '@sushiswap/ui'
import { type ReactNode, useMemo } from 'react'
import { AdditionalCurrenciesProvider } from 'src/lib/wagmi/components/token-selector/additional-currencies-provider'
import {
  CurrencyInput,
  type CurrencyInputProps,
} from 'src/lib/wagmi/components/web3-input/currency'
import type { BalanceChainId } from '~evm/_common/ui/balance-provider/types'
import { useValueTransferCatalog } from './layerzero/hooks/use-value-transfer-catalog'

export function XSwapCurrencyInput<
  TChainId extends BalanceChainId,
  TNetwork extends BalanceChainId = TChainId,
>({ className, ...props }: CurrencyInputProps<TChainId, TNetwork>): ReactNode {
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
