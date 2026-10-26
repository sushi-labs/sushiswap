import { truncateString } from 'sushi'
import type { EvmAddress } from 'sushi/evm'

export type AccountType = 'vault' | 'master' | 'sub'

export type ActiveAccount = {
  address: EvmAddress
  type: AccountType
  walletAddress: EvmAddress
  name: string
}

type LeaderVault = {
  address: EvmAddress
}

function areAddressesEqual(
  left: EvmAddress | null | undefined,
  right: EvmAddress | null | undefined,
): boolean {
  return Boolean(left && right && left.toLowerCase() === right.toLowerCase())
}

export function getMasterAccount(address: EvmAddress): ActiveAccount {
  return {
    address,
    type: 'master',
    walletAddress: address,
    name: truncateString(address, 10, 'middle'),
  }
}

export function reconcileActiveAccountWithWallet(
  activeAccount: ActiveAccount | null,
  walletAddress: EvmAddress | undefined,
): ActiveAccount | null {
  if (!walletAddress) {
    return null
  }

  if (
    !activeAccount ||
    !areAddressesEqual(activeAccount.walletAddress, walletAddress) ||
    (activeAccount.type !== 'master' &&
      activeAccount.type !== 'vault' &&
      activeAccount.type !== 'sub') ||
    (activeAccount.type === 'master' &&
      !areAddressesEqual(activeAccount.address, walletAddress))
  ) {
    return getMasterAccount(walletAddress)
  }

  return activeAccount
}

export function reconcileActiveAccountWithAccounts(
  activeAccount: ActiveAccount | null,
  walletAddress: EvmAddress | undefined,
  accounts: readonly Pick<ActiveAccount, 'address' | 'type'>[],
): ActiveAccount | null {
  const account = reconcileActiveAccountWithWallet(activeAccount, walletAddress)

  if (!walletAddress || !account || account.type === 'master') {
    return account
  }

  const isAvailableAccount = accounts.some(
    (option) =>
      option.type === account.type &&
      areAddressesEqual(option.address, account.address),
  )

  return isAvailableAccount ? account : getMasterAccount(walletAddress)
}

export function reconcileActiveAccountWithLeaderVaults(
  activeAccount: ActiveAccount | null,
  walletAddress: EvmAddress | undefined,
  leaderVaults: readonly LeaderVault[],
): ActiveAccount | null {
  if (!walletAddress) {
    return null
  }

  if (!activeAccount || activeAccount.type !== 'vault') {
    return activeAccount
  }

  return reconcileActiveAccountWithAccounts(
    activeAccount,
    walletAddress,
    leaderVaults.map((vault) => ({ address: vault.address, type: 'vault' })),
  )
}
