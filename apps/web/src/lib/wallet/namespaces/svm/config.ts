import type { Wallet, WalletConnectorConfig } from '../../types'

export enum SvmAdapterId {
  Standard = 'svm-standard',
}

const RECOMMENDED_WALLETS: Wallet[] = [
  {
    id: 'svm-solflare',
    namespace: 'svm',
    name: 'Solflare',
    icon: '', // TODO
    adapterId: SvmAdapterId.Standard,
    url: 'https://solflare.com',
  },
]

const OTHER_WALLETS: Wallet[] = []

const WALLETS: Wallet[] = [...RECOMMENDED_WALLETS, ...OTHER_WALLETS]

export const SvmWalletConfig: WalletConnectorConfig = {
  recommended: RECOMMENDED_WALLETS,
  other: OTHER_WALLETS,
  all: WALLETS,
}
