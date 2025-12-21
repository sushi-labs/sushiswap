'use client'

import type { CreateConnectorFn } from '@wagmi/core'
import { getConnectorById } from '../utils/connector'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  const [{ metaMask }] = await Promise.all([
    import('@wagmi/connectors'),
    import('@metamask/sdk'),
  ])

  createConnectorFn = metaMask()
  return createConnectorFn
}

function getConnector() {
  return getConnectorById('metaMask')
}

export const getMetaMaskConnector = async () => {
  const connector = getConnector()
  if (connector) {
    return connector
  }

  return await getCreateConnectorFn()
}
