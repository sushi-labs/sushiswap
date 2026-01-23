'use client'

import { walletConnect } from '@wagmi/connectors'
import type { CreateConnectorFn } from '@wagmi/core'
import { getConnectorById } from '../utils/connector'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  createConnectorFn = walletConnect({
    projectId: '3f44629277b155ef0caebf3dc705c4ba',
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
