'use client'

import type { CreateConnectorFn } from '@wagmi/core'
import { getConnectorById } from '../utils/connector'
import { walletConnectConnectorDefinition } from './walletconnect-definition'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  createConnectorFn = await walletConnectConnectorDefinition.load()
  return createConnectorFn
}

function getConnector() {
  return getConnectorById(walletConnectConnectorDefinition.id)
}

export const getWalletConnectConnector = async () => {
  const connector = getConnector()
  if (connector) {
    return connector
  }

  return await getCreateConnectorFn()
}
