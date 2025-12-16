import { EvmAdapterConfig } from '../namespaces/evm/config'
import type { UnifiedWalletAdapter } from '../types'

const AdapterConfig: Record<string, string> = {
  ...EvmAdapterConfig,
}

export function loadAdapter(adapterId: string): Promise<UnifiedWalletAdapter> {
  const path = AdapterConfig[adapterId]
  if (!path) throw new Error(`Unknown adapter: ${adapterId}`)
  return import(path).then((m) => m.adapter)
}
