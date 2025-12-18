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

  const [{ safe }] = await Promise.all([
    import('@wagmi/connectors'),
    import('@safe-global/safe-apps-provider'),
    import('@safe-global/safe-apps-sdk'),
  ])

  createConnectorFn = safe()
  return createConnectorFn
}

export const adapter: UnifiedWalletAdapter = {
  namespace: 'eip155',
  name: 'Safe',

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

export async function isSafeAppAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    const { default: SafeAppsSDK } = await import('@safe-global/safe-apps-sdk')
    const sdk = new SafeAppsSDK()

    // In a Safe iframe this resolves with safe info; outside it typically rejects/throws.
    await sdk.safe.getInfo()
    return true
  } catch {
    return false
  }
}
