'use client'

import type { CreateConnectorFn } from '@wagmi/core'
import { WALLET_CONNECT_PROJECT_ID } from 'src/lib/wagmi/config/connector-options'
import { getConnectorById } from '../utils/connector'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  const { walletConnect } = await import('@wagmi/connectors')
  createConnectorFn = walletConnect({
    projectId: WALLET_CONNECT_PROJECT_ID,
  })
  return createConnectorFn
}

function getConnector() {
  return getConnectorById('walletConnect')
}

export const getWalletConnectConnector = async () => {
  const connector = getConnector()
  if (connector) {
    return connector
  }

  return await getCreateConnectorFn()
}
