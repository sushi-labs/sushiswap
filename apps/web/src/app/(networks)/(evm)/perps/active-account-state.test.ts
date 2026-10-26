import type { EvmAddress } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import {
  type ActiveAccount,
  getMasterAccount,
  reconcileActiveAccountWithAccounts,
  reconcileActiveAccountWithLeaderVaults,
  reconcileActiveAccountWithWallet,
} from './active-account-state'

const walletAddress: EvmAddress = '0x52908400098527886E0F7030069857D2E4169EE7'
const otherWalletAddress: EvmAddress =
  '0xde709f2102306220921060314715629080e2fb77'
const accountAddress: EvmAddress = '0x27b1fdb04752bbc536007a920d24acb045561c26'
const uppercaseAccountAddress: EvmAddress =
  '0x27B1FDB04752BBC536007A920D24ACB045561C26'

const subAccount: ActiveAccount = {
  address: accountAddress,
  type: 'sub',
  walletAddress,
  name: 'Trading account',
}
const vaultAccount: ActiveAccount = {
  ...subAccount,
  type: 'vault',
  name: 'Trading vault',
}

describe('reconcileActiveAccountWithWallet', () => {
  it.each([subAccount, vaultAccount])(
    'preserves a $type account for its owner regardless of address casing',
    (account) => {
      expect(
        reconcileActiveAccountWithWallet(account, walletAddress.toLowerCase()),
      ).toBe(account)
    },
  )

  it.each([subAccount, vaultAccount])(
    'clears a $type selection on disconnect and resets it on wallet switch',
    (account) => {
      expect(reconcileActiveAccountWithWallet(account, undefined)).toBeNull()
      expect(
        reconcileActiveAccountWithWallet(account, otherWalletAddress),
      ).toEqual(getMasterAccount(otherWalletAddress))
    },
  )

  it('rejects a master account whose address differs from its owner', () => {
    expect(
      reconcileActiveAccountWithWallet(
        { ...subAccount, type: 'master' },
        walletAddress,
      ),
    ).toEqual(getMasterAccount(walletAddress))
  })
})

describe('reconcileActiveAccountWithAccounts', () => {
  it.each([subAccount, vaultAccount])(
    'preserves a listed $type account regardless of address casing',
    (account) => {
      expect(
        reconcileActiveAccountWithAccounts(
          account,
          walletAddress.toLowerCase(),
          [{ address: uppercaseAccountAddress, type: account.type }],
        ),
      ).toBe(account)
    },
  )

  it.each([subAccount, vaultAccount])(
    'resets a removed $type account to its master account',
    (account) => {
      expect(
        reconcileActiveAccountWithAccounts(account, walletAddress, []),
      ).toEqual(getMasterAccount(walletAddress))
    },
  )

  it.each([
    [subAccount, vaultAccount],
    [vaultAccount, subAccount],
  ])('requires both account type and address to match', (account, listed) => {
    expect(
      reconcileActiveAccountWithAccounts(account, walletAddress, [listed]),
    ).toEqual(getMasterAccount(walletAddress))
  })

  it('reconciles wallet ownership before accepting an account from the list', () => {
    expect(
      reconcileActiveAccountWithAccounts(subAccount, otherWalletAddress, [
        subAccount,
      ]),
    ).toEqual(getMasterAccount(otherWalletAddress))
    expect(
      reconcileActiveAccountWithAccounts(subAccount, undefined, [subAccount]),
    ).toBeNull()
  })

  it('preserves master accounts and defaults an empty selection to the connected wallet', () => {
    const masterAccount = getMasterAccount(walletAddress)

    expect(
      reconcileActiveAccountWithAccounts(masterAccount, walletAddress, []),
    ).toBe(masterAccount)
    expect(reconcileActiveAccountWithAccounts(null, walletAddress, [])).toEqual(
      masterAccount,
    )
    expect(reconcileActiveAccountWithAccounts(null, undefined, [])).toBeNull()
  })
})

describe('reconcileActiveAccountWithLeaderVaults', () => {
  it('does not invalidate a subaccount when reconciling only leader vaults', () => {
    expect(
      reconcileActiveAccountWithLeaderVaults(subAccount, walletAddress, []),
    ).toBe(subAccount)
  })

  it('still preserves listed vaults and resets removed vaults', () => {
    expect(
      reconcileActiveAccountWithLeaderVaults(vaultAccount, walletAddress, [
        { address: uppercaseAccountAddress },
      ]),
    ).toBe(vaultAccount)
    expect(
      reconcileActiveAccountWithLeaderVaults(vaultAccount, walletAddress, []),
    ).toEqual(getMasterAccount(walletAddress))
  })
})
