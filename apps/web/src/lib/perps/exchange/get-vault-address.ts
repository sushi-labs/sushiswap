import type { EvmAddress } from 'sushi/evm'
import type { ActiveAccount } from '~evm/perps/active-account-state'

export function getVaultAddress(
  activeAccount: ActiveAccount | null,
): EvmAddress | undefined {
  // Hyperliquid uses vaultAddress for both vaults and subaccounts.
  return activeAccount?.type === 'vault' || activeAccount?.type === 'sub'
    ? activeAccount.address
    : undefined
}
