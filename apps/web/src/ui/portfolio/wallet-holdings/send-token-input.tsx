import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import type { EvmChainId } from 'sushi/chain'
import { isWNativeSupported } from 'sushi/config'
import { useSendTokens } from './send-token-provider'

export const SendTokenInput = () => {
  const { mutate, state } = useSendTokens()
  return (
    <Web3Input.Currency
      id="send"
      type="INPUT"
      className="overflow-visible p-4 bg-gray-100 rounded-xl dark:bg-slate-900"
      value={state.amount ?? ''}
      chainId={state.token0?.chainId as EvmChainId}
      onSelect={mutate.setToken0}
      onChange={(value) => mutate.setAmount(value)}
      currency={state.token0}
      loading={false}
      fetching={false}
      currencyLoading={false}
      allowNative={isWNativeSupported(1)}
      label="Amount"
      showQuickSelect={false}
      inputClassName="!text-slate-900 dark:!text-slate-200 placeholder:text-slate-900 placeholder:dark:text-slate-200"
      labelClassName="font-medium"
    />
  )
}
