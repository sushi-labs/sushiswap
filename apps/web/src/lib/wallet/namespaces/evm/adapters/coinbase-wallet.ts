'use client'

import { coinbaseWallet } from '@wagmi/connectors'
import type { CreateConnectorFn } from '@wagmi/core'
import { getConnectorById } from '../utils/connector'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  createConnectorFn = coinbaseWallet({
    preference: { options: 'all', telemetry: false },
  })
  return createConnectorFn
}

function getConnector() {
  return getConnectorById('coinbaseWalletSDK')
}

export const getCoinbaseWalletConnector = async () => {
  const connector = getConnector()
  if (connector) {
    return connector
  }

  return await getCreateConnectorFn()
}
