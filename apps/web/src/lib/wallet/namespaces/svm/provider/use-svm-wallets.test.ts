import { createConnectorId } from '@solana/connector'
import { describe, expect, it } from 'vitest'
import {
  PRIVY_SVM_CONNECTOR_ID,
  PRIVY_SVM_WALLET,
  SvmAdapterId,
} from '../config'
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
  })
})
