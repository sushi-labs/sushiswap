import { rpc } from '@stellar/stellar-sdk'
import { useMutation } from '@tanstack/react-query'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { stellarWalletKit } from 'src/lib/wallet/namespaces/stellar/config'
import type { StellarAddress, StellarCurrency } from 'sushi/stellar'
import { NETWORK_PASSPHRASE } from '~stellar/_common/lib/constants'
import { getTokenContractClient } from '~stellar/_common/lib/soroban/client'
import { DEFAULT_TIMEOUT } from '~stellar/_common/lib/soroban/constants'
import {
  submitTransaction,
  waitForTransaction,
} from '~stellar/_common/lib/soroban/transaction-helpers'

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

      const tokenContract = getTokenContractClient({
        contractId: currency.address,
        publicKey: activeWalletAddress,
      })
      const assembledTransaction = await tokenContract.transfer(
        {
          from: activeWalletAddress,
          to: destination,
          amount,
        },
        {
          fee: 100_000,
          timeoutInSeconds: DEFAULT_TIMEOUT,
        },
      )

      if (
        assembledTransaction.simulation &&
        rpc.Api.isSimulationError(assembledTransaction.simulation)
      ) {
        throw new Error(assembledTransaction.simulation.error)
      }

      const { signedTxXdr } = await stellarWalletKit.signTransaction(
        assembledTransaction.toXDR(),
        {
          address: activeWalletAddress,
          networkPassphrase: NETWORK_PASSPHRASE,
        },
      )
      const { hash } = await submitTransaction(signedTxXdr)
      const result = await waitForTransaction(hash)

      if (result.status !== 'SUCCESS') {
        throw new Error(`Stellar transfer ${hash} ${result.status}`)
      }

      return hash
    },
  })

  return {
    transferStellarTokenAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
