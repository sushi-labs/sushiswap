'use client'

import {
  type CreateConnectorFn,
  connect,
  disconnect,
  getConnection,
} from '@wagmi/core'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import type { UnifiedWalletAdapter } from '../../../types'

let createConnectorFn: CreateConnectorFn | undefined

async function connectorFn() {
  if (createConnectorFn) return createConnectorFn

  const [{ metaMask }] = await Promise.all([
    import('@wagmi/connectors'),
    import('@metamask/sdk'),
  ])

  createConnectorFn = metaMask()
  return createConnectorFn
}

export const adapter: UnifiedWalletAdapter = {
  namespace: 'eip155',
  name: 'MetaMask',

  isConnected() {
    return getConnection(getWagmiConfig()).isConnected
  },

  getAddress() {
    const a = getConnection(getWagmiConfig())
    return a.isConnected ? a.address : undefined
  },

  async connect() {
    const connector = await connectorFn()
    await connect(getWagmiConfig(), { connector })
  },

  async disconnect() {
    await disconnect(getWagmiConfig())
  },
}
