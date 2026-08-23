'use client'

import { useSendTransaction as usePrivySendTransaction } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { usePrivyEmbeddedWallet } from 'src/lib/wallet/hooks/use-privy-embedded'
import type { Amount } from 'sushi'
import type { EvmAddress, EvmCurrency } from 'sushi/evm'
import {
  usePublicClient,
  useSendTransaction as useWagmiSendTransaction,
} from 'wagmi'
import {
  getEvmTokenTransferRequest,
  getEvmTokenTransferUiOptions,
} from './get-evm-token-transfer-request'

type TransferEvmTokenArgs = {
  amount: Amount<EvmCurrency>
  destination: EvmAddress
}

export function useTransferEvmToken(currency: EvmCurrency | undefined) {
  const activeWalletAddress = useAccount('evm')
  const privyEmbeddedWallet = usePrivyEmbeddedWallet('evm')
  const publicClient = usePublicClient({ chainId: currency?.chainId })
  const { sendTransaction: sendPrivyTransaction } = usePrivySendTransaction()
  const { mutateAsync: sendWagmiTransaction } = useWagmiSendTransaction()
  const isPrivyEmbeddedWalletActive = useMemo(
    () =>
      Boolean(
        activeWalletAddress &&
          privyEmbeddedWallet?.address &&
          activeWalletAddress.toLowerCase() ===
            privyEmbeddedWallet.address.toLowerCase(),
      ),
    [activeWalletAddress, privyEmbeddedWallet?.address],
  )

  const mutation = useMutation({
    mutationKey: [
      'use-transfer-evm-token',
      activeWalletAddress,
      currency?.chainId,
      currency?.id,
    ],
    mutationFn: async ({ amount, destination }: TransferEvmTokenArgs) => {
      if (!activeWalletAddress) {
        throw new Error('EVM wallet not connected')
      }

      if (!currency || amount.currency.id !== currency.id) {
        throw new Error('Transfer currency changed')
      }

      const request = getEvmTokenTransferRequest({ amount, destination })
      const uiOptions = getEvmTokenTransferUiOptions({ amount, destination })

      const hash =
        isPrivyEmbeddedWalletActive && privyEmbeddedWallet
          ? (
              await sendPrivyTransaction(request, {
                address: privyEmbeddedWallet.address,
                uiOptions,
              })
            ).hash
          : await sendWagmiTransaction({
              ...request,
              account: activeWalletAddress,
            })

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash })
      }

      return hash
    },
  })

  return {
    transferEvmTokenAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
