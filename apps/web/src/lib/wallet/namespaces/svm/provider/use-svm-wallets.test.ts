import { createConnectorId } from '@solana/connector'
import { describe, expect, it } from 'vitest'
import {
  PRIVY_SVM_CONNECTOR_ID,
  PRIVY_SVM_WALLET,
  PRIVY_X_SVM_WALLET,
  SvmAdapterId,
} from '../config'
import { getSvmWallets } from './use-svm-wallets'

describe('getSvmWallets', () => {
  it('exposes separate Email and X entries before Privy is loaded', () => {
    const wallets = getSvmWallets({
      wallets: [],
      isRecentWallet: () => false,
    })

    expect(
      wallets.filter((wallet) => wallet.adapterId === SvmAdapterId.Privy),
    ).toEqual([
      expect.objectContaining({
        id: PRIVY_SVM_WALLET.id,
        name: 'Email',
        loginMethod: 'email',
        isAvailable: true,
        isInstalled: false,
      }),
      expect.objectContaining({
        id: PRIVY_X_SVM_WALLET.id,
        name: 'X',
        loginMethod: 'twitter',
        isAvailable: true,
        isInstalled: false,
      }),
    ])
  })

  it('identifies Privy by connector ID instead of display name', () => {
    const wallets = getSvmWallets({
      wallets: [
        {
          connectorId: createConnectorId('Privy'),
          icon: undefined,
          installed: true,
          name: 'Renamed wallet',
        },
      ],
      isRecentWallet: () => false,
    })

    expect(createConnectorId('Privy')).toBe(PRIVY_SVM_CONNECTOR_ID)

    expect(wallets).toContainEqual(
      expect.objectContaining({
        adapterId: SvmAdapterId.Privy,
        id: PRIVY_SVM_WALLET.id,
        name: PRIVY_SVM_WALLET.name,
      }),
    )
    expect(wallets).toContainEqual(
      expect.objectContaining({
        adapterId: SvmAdapterId.Privy,
        id: PRIVY_X_SVM_WALLET.id,
        name: PRIVY_X_SVM_WALLET.name,
      }),
    )
  })
})
