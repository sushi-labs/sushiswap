import { rpc } from '@stellar/stellar-sdk'
import { getStellarWalletKit } from 'src/lib/wallet/namespaces/stellar/config'
import type { StellarAddress, StellarCurrency } from 'sushi/stellar'
import { NETWORK_PASSPHRASE } from '~stellar/_common/lib/constants'
import { getTokenContractClient } from '~stellar/_common/lib/soroban/client'
import { DEFAULT_TIMEOUT } from '~stellar/_common/lib/soroban/constants'
import {
  submitTransaction,
  waitForTransaction,
} from '~stellar/_common/lib/soroban/transaction-helpers'

/**
 * Kept out of the hook module so `@stellar/stellar-sdk` and the Soroban
 * helpers stay off the portfolio's import graph, which the app-wide sidebar
 * pulls into every route. `use-transfer-stellar-token` imports this lazily,
 * mirroring `use-stellar-balances`/`fetch-stellar-balances`.
 */
export async function transferStellarToken({
  account,
  amount,
  currency,
  destination,
}: {
  account: StellarAddress
  amount: bigint
  currency: StellarCurrency
  destination: StellarAddress
}): Promise<string> {
  const tokenContract = getTokenContractClient({
    contractId: currency.address,
    publicKey: account,
  })
  const assembledTransaction = await tokenContract.transfer(
    {
      from: account,
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

  const kit = await getStellarWalletKit()
  const { signedTxXdr } = await kit.signTransaction(
    assembledTransaction.toXDR(),
    {
      address: account,
      networkPassphrase: NETWORK_PASSPHRASE,
    },
  )
  const { hash } = await submitTransaction(signedTxXdr)
  const result = await waitForTransaction(hash)

  if (result.status !== 'SUCCESS') {
    throw new Error(`Stellar transfer ${hash} ${result.status}`)
  }

  return hash
}
