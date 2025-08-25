'use client'

import { useGetTokenAmount } from 'src/lib/hooks/useGetTokenAmount'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import { useDerivedStateFiat } from './derivedstate-fiat-provider'

export const FiatToken1Input = () => {
  const {
    state: { chainId, token1, swapAmountString, token0, paymentType },
    mutate: { setToken1 },
    isToken1Loading: isLoading,
  } = useDerivedStateFiat()

  const { tokenAmount } = useGetTokenAmount({
    countryCode: token0?.code,
    sourceCurrencyCode: token0?.symbol || 'USD',
    amount: swapAmountString ? Number(swapAmountString) : undefined,
    destinationTokenSymbol: token1?.symbol,
    paymentMethodType: paymentType === 'apple-pay' ? 'APPLE_PAY' : 'CARD',
  })

  return (
    <Web3Input.Currency
      id="swap-to"
      type="OUTPUT"
      disabled
      className="border border-accent p-3 bg-gray-100 dark:bg-slate-900 rounded-xl overflow-visible"
      value={tokenAmount ? tokenAmount.toString() : ''}
      chainId={chainId}
      onSelect={setToken1}
      currency={token1}
      disableMaxButton
      currencyLoading={isLoading}
      allowNative={isWNativeSupported(chainId)}
      label="Buy"
      showQuickSelect={true}
    />
  )
}
