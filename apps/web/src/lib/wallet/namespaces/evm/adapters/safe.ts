'use client'

import {
  type CreateConnectorFn,
  connect,
  disconnect,
  getConnection,
} from '@wagmi/core'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import type { WalletAdapter } from '../../../types'
import { getConnectorById } from '../utils/connector'

const CONNECTOR_ID = 'safe'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  const [{ safe }] = await Promise.all([
    import('@wagmi/connectors'),
    import('@safe-global/safe-apps-provider'),
    import('@safe-global/safe-apps-sdk'),
  ])

  createConnectorFn = safe()
  return createConnectorFn
}

function getConnector() {
  return getConnectorById(CONNECTOR_ID)
}

export const adapter: WalletAdapter = {
  namespace: 'eip155',
  name: 'Safe',

  isConnected() {
    const { connector, isConnected } = getConnection(getWagmiConfig())

    return connector?.id === CONNECTOR_ID && isConnected
  },

  getAddress() {
    const { connector, address } = getConnection(getWagmiConfig())

    return connector?.id === CONNECTOR_ID ? address : undefined
  },

  async connect() {
    const connector = getConnector()

    await connect(getWagmiConfig(), {
      connector: connector ?? (await getCreateConnectorFn()),
    })
  },

  async disconnect() {
    const connector = getConnector()

    if (connector) {
      await disconnect(getWagmiConfig(), { connector })
    }
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
