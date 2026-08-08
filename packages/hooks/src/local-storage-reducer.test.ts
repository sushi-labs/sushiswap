import { describe, expect, it } from 'vitest'
import {
  type LocalStorageState,
  localStorageReducer,
} from './local-storage-reducer'

describe('localStorageReducer', () => {
  it('sequences back-to-back functional updates', () => {
    const initial: LocalStorageState<string[]> = {
      value: [],
      persistence: 'none',
      revision: 0,
    }

    const withFirstWallet = localStorageReducer(initial, {
      type: 'set',
      value: (wallets) => [...wallets, 'wallet-a'],
    })
    const withBothWallets = localStorageReducer(withFirstWallet, {
      type: 'set',
      value: (wallets) => [...wallets, 'wallet-b'],
    })

    expect(withBothWallets).toEqual({
      value: ['wallet-a', 'wallet-b'],
      persistence: 'set',
      revision: 2,
    })
  })

  it('does not persist values received from another hook instance', () => {
    expect(
      localStorageReducer(
        { value: ['wallet-a'], persistence: 'set', revision: 1 },
        { type: 'sync', value: ['wallet-a', 'wallet-b'] },
      ),
    ).toEqual({
      value: ['wallet-a', 'wallet-b'],
      persistence: 'none',
      revision: 1,
    })
  })
})
