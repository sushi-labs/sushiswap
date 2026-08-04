import type { SendTransactionModalUIOptions } from '@privy-io/react-auth'
import type { Amount } from 'sushi'
import type { EvmAddress, EvmChainId, EvmCurrency } from 'sushi/evm'
import { type Hex, encodeFunctionData, erc20Abi } from 'viem'

export type EvmTokenTransferRequest = {
  chainId: EvmChainId
  data?: Hex
  to: EvmAddress
  value: bigint
}

export function getEvmTokenTransferRequest({
  amount,
  destination,
}: {
  amount: Amount<EvmCurrency>
  destination: EvmAddress
}): EvmTokenTransferRequest {
  const { currency } = amount

  if (currency.isNative) {
    return {
      chainId: currency.chainId,
      to: destination,
      value: amount.amount,
    }
  }

  return {
    chainId: currency.chainId,
    to: currency.wrap().address,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [destination, amount.amount],
    }),
    value: 0n,
  }
}

export function getEvmTokenTransferUiOptions({
  amount,
  destination,
}: {
  amount: Amount<EvmCurrency>
  destination: EvmAddress
}): SendTransactionModalUIOptions {
  const symbol = amount.currency.symbol ?? 'token'

  return {
    showWalletUIs: true,
    description: `Send ${amount.toSignificant(6)} ${symbol} to ${destination}`,
    buttonText: 'Send',
    successHeader: `${symbol} sent`,
    successDescription: 'Your transfer was submitted successfully.',
    isCancellable: true,
  }
}
