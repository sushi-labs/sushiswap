import type { EvmAddress } from 'sushi/evm'

export type AccountType = 'vault' | 'master'

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

function getMasterAccount(address: EvmAddress): ActiveAccount {
  return {
    address,
    type: 'master',
    walletAddress: address,
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
    (activeAccount.type !== 'master' && activeAccount.type !== 'vault') ||
    (activeAccount.type === 'master' &&
      !areAddressesEqual(activeAccount.address, walletAddress))
  ) {
    return getMasterAccount(walletAddress)
  }

  return activeAccount
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

  const isLeaderVault = leaderVaults.some((vault) =>
    areAddressesEqual(vault.address, activeAccount.address),
  )

  return isLeaderVault ? activeAccount : getMasterAccount(walletAddress)
}
