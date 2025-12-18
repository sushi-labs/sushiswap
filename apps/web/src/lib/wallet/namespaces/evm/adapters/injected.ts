'use client'

import {
  type Connector,
  connect,
  disconnect,
  getConnection,
  getConnectors,
  injected,
} from '@wagmi/core'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import type { WalletAdapter, WalletAdapterContext } from '../../../types'

function getConnector(uid: string | undefined) {
  const connectors = getConnectors(getWagmiConfig())
  if (uid) {
    return connectors.find((connector) => connector.uid === uid)
  } else {
    return connectors.find((connector) => isInjectedConnector(connector))
  }
}

export function createAdapter(ctx?: WalletAdapterContext): WalletAdapter {
  const uid = ctx?.uid

  return {
    namespace: 'eip155',
    name: 'Injected',

    isConnected() {
      const { connector, isConnected } = getConnection(getWagmiConfig())

      return connector &&
        (uid ? connector.uid === uid : isInjectedConnector(connector))
        ? isConnected
        : false
    },

    getAddress() {
      const { connector, address } = getConnection(getWagmiConfig())

      return connector &&
        (uid ? connector.uid === uid : isInjectedConnector(connector))
        ? address
        : undefined
    },

    async connect() {
      const connector = getConnector(uid)

      await connect(getWagmiConfig(), { connector: connector ?? injected() })
    },

    async disconnect() {
      const connector = getConnector(uid)

      if (connector) {
        await disconnect(getWagmiConfig(), { connector })
      }
    },
  }
}

export function isInjectedConnector(connector: Connector) {
  return (
    connector.type === 'injected' ||
    connector.id === 'injected' ||
    connector.name.toLowerCase().includes('injected')
  )
}
