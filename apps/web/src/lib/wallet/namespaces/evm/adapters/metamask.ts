'use client'

import type { CreateConnectorFn } from '@wagmi/core'
import { withConnectorSetupErrorLogging } from 'src/lib/wagmi/config/connector-utils'
import { getConnectorById } from '../utils/connector'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  const { metaMask } = await import('@wagmi/connectors')
  createConnectorFn = withConnectorSetupErrorLogging(metaMask(), 'MetaMask')
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
