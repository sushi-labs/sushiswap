'use client'

import { connect, disconnect, getConnection, getConnectors } from '@wagmi/core'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import type { ConnectOptions, UnifiedWalletAdapter } from '../../../types'

export const adapter: UnifiedWalletAdapter = {
  namespace: 'eip155',
  name: 'Injected',

  isConnected() {
    return getConnection(getWagmiConfig()).isConnected
  },

  getAddress() {
    const a = getConnection(getWagmiConfig())
    return a.isConnected ? a.address : undefined
  },

  async connect(opts?: ConnectOptions) {
    const uid = opts?.wallet?.uid
    if (!uid) throw new Error('No connector uid specified')
    const connector = getConnectors(getWagmiConfig()).find(
      (connector) => connector.uid === uid,
    )
    if (!connector) throw new Error(`Connector not found: ${uid}`)

    await connect(getWagmiConfig(), { connector })
  },

  async disconnect() {
    await disconnect(getWagmiConfig())
  },
}
