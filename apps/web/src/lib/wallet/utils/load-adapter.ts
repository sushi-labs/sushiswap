import { EvmAdapterConfig } from '../namespaces/evm/config'
import type { UnifiedWalletAdapter } from '../types'

const AdapterConfig: Record<string, () => Promise<UnifiedWalletAdapter>> = {
  ...EvmAdapterConfig,
}

export function loadAdapter(adapterId: string): Promise<UnifiedWalletAdapter> {
  const adapter = AdapterConfig[adapterId]
  if (!adapter) throw new Error(`Unknown adapter: ${adapterId}`)

  return adapter()
}
