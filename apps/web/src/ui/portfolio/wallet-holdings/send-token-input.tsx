import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { isWNativeSupported } from 'sushi/config'
import type { Type } from 'sushi/currency'
import { useSendTokens } from './send-token-provider'

export const SendTokenInput = ({
  currency,
}: {
  currency: Type | undefined
}) => {
  const { mutate, state } = useSendTokens()
  return (
    <Web3Input.Currency
      id="send"
      type="INPUT"
      className="overflow-visible p-4 bg-gray-100 rounded-xl dark:bg-slate-900"
      value={state.amount ?? ''}
      chainId={1}
      onSelect={mutate.setToken0}
      onChange={(value) => mutate.setAmount(value)}
      currency={currency}
      loading={false}
      fetching={false}
      currencyLoading={false}
      allowNative={isWNativeSupported(1)}
      label="Amount"
      showQuickSelect={false}
    />
  )
}
