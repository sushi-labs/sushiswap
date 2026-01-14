'use client'

import { metaMask } from '@wagmi/connectors'
import type { CreateConnectorFn } from '@wagmi/core'
import { getConnectorById } from '../utils/connector'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  createConnectorFn = metaMask()
  return createConnectorFn
}

function getConnector() {
  return getConnectorById('metaMaskSDK')
}

export const getMetaMaskConnector = async () => {
  const connector = getConnector()
  if (connector) {
    return connector
  }

  return await getCreateConnectorFn()
}
