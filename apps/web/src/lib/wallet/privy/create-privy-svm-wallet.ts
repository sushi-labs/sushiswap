'use client'

import type { PrivyStandardWallet } from '@privy-io/react-auth/solana'
import { getBase58Encoder } from '@solana/kit'
import type { Wallet, WalletAccount } from '@wallet-standard/base'
import type { SvmAddress } from 'sushi/svm'

const ACCOUNT_FEATURES = [
  'solana:signAndSendTransaction',
  'solana:signTransaction',
  'solana:signMessage',
] as const

/**
 * Privy only populates `PrivyStandardWallet.accounts` after its shared wallet
 * readiness gate opens. That gate also depends on EVM connector state, so a
 * lazily mounted, Solana-only login can have an authenticated linked account
 * while the standard wallet remains empty.
 *
 * Keep Privy's wallet and signing implementations, but surface the linked
 * account that Privy has already authorized so Wallet Standard can connect.
 */
export function createPrivySvmWallet({
  address,
  wallet,
}: {
  address: SvmAddress
  wallet: PrivyStandardWallet
}): Wallet {
  const account: WalletAccount = Object.freeze({
    address,
    publicKey: getBase58Encoder().encode(address),
    chains: wallet.chains,
    features: ACCOUNT_FEATURES,
    label: wallet.name,
    icon: wallet.icon,
  })

  const connect: PrivyStandardWallet['features']['standard:connect']['connect'] =
    async () => ({ accounts: [account] })
  const disconnect: PrivyStandardWallet['features']['standard:disconnect']['disconnect'] =
    async () => undefined
  const on: PrivyStandardWallet['features']['standard:events']['on'] =
    () => () =>
      undefined

  return Object.freeze({
    version: wallet.version,
    name: wallet.name,
    icon: wallet.icon,
    chains: wallet.chains,
    accounts: [account],
    features: {
      ...wallet.features,
      'standard:connect': {
        ...wallet.features['standard:connect'],
        connect,
      },
      'standard:disconnect': {
        ...wallet.features['standard:disconnect'],
        disconnect,
      },
      'standard:events': {
        ...wallet.features['standard:events'],
        on,
      },
    },
  })
}
