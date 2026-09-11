import { getWagmiConfig } from 'src/lib/wagmi/config'
import { getPrivyEvmConnector } from 'src/lib/wallet/privy/privy-evm-connector'
import type { Connector } from 'wagmi'

export async function getPrivyConnector(): Promise<Connector> {
  const connector = getPrivyEvmConnector(getWagmiConfig())
  if (!connector) throw new Error('Privy EVM connector is unavailable')
  return connector
}
