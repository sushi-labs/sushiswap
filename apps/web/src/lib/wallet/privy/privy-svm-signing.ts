import type { SendTransactionModalUIOptions } from '@privy-io/react-auth'
import type { Wallet, WalletAccount } from '@wallet-standard/base'

interface PrivySvmSignTransactionFeature {
  signTransaction(input: {
    account: WalletAccount
    chain: 'solana:mainnet'
    transaction: Uint8Array
  }): Promise<readonly { signedTransaction: Uint8Array }[]>
}

interface PrivySvmSignAndSendTransactionFeature {
  signAndSendTransaction(input: {
    account: WalletAccount
    chain: 'solana:mainnet'
    options?: { uiOptions?: SendTransactionModalUIOptions }
    transaction: Uint8Array
  }): Promise<readonly { signature: Uint8Array }[]>
}

function getWalletAccount(wallet: Wallet, address: string): WalletAccount {
  const account = wallet.accounts.find((account) => account.address === address)
  if (!account) throw new Error('Privy SVM wallet account is unavailable')
  return account
}

export async function signPrivySvmTransaction({
  address,
  transaction,
  wallet,
}: {
  address: string
  transaction: Uint8Array
  wallet: Wallet
}): Promise<{ signedTransaction: Uint8Array }> {
  const feature = wallet.features['solana:signTransaction'] as
    | PrivySvmSignTransactionFeature
    | undefined
  if (!feature) throw new Error('Privy SVM wallet cannot sign transactions')

  const [result] = await feature.signTransaction({
    account: getWalletAccount(wallet, address),
    chain: 'solana:mainnet',
    transaction,
  })
  if (!result) throw new Error('Privy did not return a signed transaction')
  return result
}

export async function signAndSendPrivySvmTransaction({
  address,
  transaction,
  uiOptions,
  wallet,
}: {
  address: string
  transaction: Uint8Array
  uiOptions?: SendTransactionModalUIOptions
  wallet: Wallet
}): Promise<{ signature: Uint8Array }> {
  const feature = wallet.features['solana:signAndSendTransaction'] as
    | PrivySvmSignAndSendTransactionFeature
    | undefined
  if (!feature) {
    throw new Error('Privy SVM wallet cannot sign and send transactions')
  }

  const [result] = await feature.signAndSendTransaction({
    account: getWalletAccount(wallet, address),
    chain: 'solana:mainnet',
    options: { uiOptions },
    transaction,
  })
  if (!result) throw new Error('Privy did not return a transaction signature')
  return result
}
