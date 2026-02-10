import { getConnectors } from '@wagmi/core'
import { getWagmiConfig } from 'src/lib/wagmi/config'

export function getConnectorById(id: string) {
  return getConnectors(getWagmiConfig()).find(
    (connector) => connector.id.toLowerCase() === id.toLowerCase(),
  )
}
