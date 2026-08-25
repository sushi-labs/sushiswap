import { describe, expect, it } from 'vitest'
import { PRIVY_SVM_WALLET, SvmAdapterId } from '../config'
import { getSvmWallets } from './use-svm-wallets'

describe('getSvmWallets', () => {
  it('exposes the Email wallet before the Privy runtime is loaded', () => {
    const wallets = getSvmWallets({
      wallets: [],
      isRecentWallet: () => false,
    })

    expect(
      wallets.find((wallet) => wallet.adapterId === SvmAdapterId.Privy),
    ).toMatchObject({
      id: PRIVY_SVM_WALLET.id,
      name: 'Email',
      isAvailable: true,
      isInstalled: false,
    })
  })
})
