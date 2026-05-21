import * as StellarSdk from '@stellar/stellar-sdk'
import { Horizon } from '@stellar/stellar-sdk'
import {
  HORIZON_URL,
  NETWORK_PASSPHRASE,
} from 'src/app/(networks)/(non-evm)/stellar/_common/lib/constants'
import type { Amount } from 'sushi'
import {
  STELLAR_XLM_ADDRESS,
  type StellarAccountAddress,
  StellarChainId,
  type StellarToken,
  type StellarTxHash,
} from 'sushi/stellar'

const horizonServer = new Horizon.Server(HORIZON_URL)

function createMemo(memo?: string) {
  if (!memo) return StellarSdk.Memo.none()
  if (/^\d+$/.test(memo)) {
    return StellarSdk.Memo.id(memo)
  }
  return StellarSdk.Memo.text(memo)
}

function getPaymentAsset(token: StellarToken): StellarSdk.Asset {
  if (token.address === STELLAR_XLM_ADDRESS[StellarChainId.STELLAR]) {
    return StellarSdk.Asset.native()
  }

  if (!token.issuer) {
    throw new Error('Stellar issued token is missing issuer metadata')
  }

  return new StellarSdk.Asset(token.symbol, token.issuer)
}

export async function submitNearIntentsStellarPayment({
  amount,
  destination,
  memo,
  signTransaction,
  sourceAddress,
}: {
  amount: Amount<StellarToken>
  destination: StellarAccountAddress
  memo?: string
  signTransaction: (xdr: string) => Promise<string>
  sourceAddress: StellarAccountAddress
}): Promise<{ txHash: StellarTxHash }> {
  const account = await horizonServer.loadAccount(sourceAddress)
  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        asset: getPaymentAsset(amount.currency),
        amount: amount.toString(),
        destination,
      }),
    )
    .addMemo(createMemo(memo))
    .setTimeout(180)
    .build()

  const signedXdr = await signTransaction(transaction.toXDR())
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE,
  )
  const result = await horizonServer.submitTransaction(signedTx)

  return { txHash: result.hash }
}
