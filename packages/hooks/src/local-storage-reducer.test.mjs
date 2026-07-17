import { deepStrictEqual } from 'node:assert'
import { describe, it } from 'node:test'
import { localStorageReducer } from './local-storage-reducer.ts'

describe('localStorageReducer', () => {
  it('sequences back-to-back functional updates', () => {
    const initial = {
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

    deepStrictEqual(withBothWallets, {
      value: ['wallet-a', 'wallet-b'],
      persistence: 'set',
      revision: 2,
    })
  })

  it('does not persist values received from another hook instance', () => {
    deepStrictEqual(
      localStorageReducer(
        { value: ['wallet-a'], persistence: 'set', revision: 1 },
        { type: 'sync', value: ['wallet-a', 'wallet-b'] },
      ),
      {
        value: ['wallet-a', 'wallet-b'],
        persistence: 'none',
        revision: 1,
      },
    )
  })
})
