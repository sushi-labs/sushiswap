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

const CONNECTOR_ID = 'walletConnect'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  const [{ walletConnect }] = await Promise.all([
    import('@wagmi/connectors'),
    import('@walletconnect/ethereum-provider'),
  ])

  createConnectorFn = walletConnect({
    projectId: '3f44629277b155ef0caebf3dc705c4ba',
  })
  return createConnectorFn
}

function getConnector() {
  return getConnectorById(CONNECTOR_ID)
}

export const adapter: WalletAdapter = {
  namespace: 'eip155',
  name: 'WalletConnect',

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
