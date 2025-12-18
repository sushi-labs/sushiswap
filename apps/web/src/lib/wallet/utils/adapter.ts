import { AdapterConfig } from '../config'
import type { Wallet, WalletAdapter } from '../types'

export function getWalletAdapter(wallet: Wallet): Promise<WalletAdapter> {
  const adapter = AdapterConfig[wallet.adapterId]
  if (!adapter)
    throw new Error(
      `Unknown adapter: ${wallet.adapterId} for wallet: ${wallet.name}`,
    )

  return adapter(wallet)
}
