import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import type { StellarAddress, StellarCurrency } from 'sushi/stellar'

interface TransferStellarTokenArgs {
  amount: bigint
  destination: StellarAddress
}

export function useTransferStellarToken(currency: StellarCurrency | undefined) {
  const activeWalletAddress = useAccount('stellar')

  const mutation = useMutation({
    mutationKey: [
      'use-transfer-stellar-token',
      activeWalletAddress,
      currency?.id,
    ],
    mutationFn: async ({
      amount,
      destination,
    }: TransferStellarTokenArgs): Promise<string> => {
      if (!activeWalletAddress) {
        throw new Error('Stellar wallet not connected')
      }
      if (!currency) {
        throw new Error('Stellar transfer currency is required')
      }
      if (amount <= 0n) {
        throw new Error('Transfer amount must be greater than zero')
      }

      const { transferStellarToken } = await import('./transfer-stellar-token')
      return transferStellarToken({
        account: activeWalletAddress,
        amount,
        currency,
        destination,
      })
    },
  })

  return {
    transferStellarTokenAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
