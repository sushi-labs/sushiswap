'use client'

import type { CreateConnectorFn } from '@wagmi/core'
import { evmConnectorFactories } from 'src/lib/wagmi/config/connector-factories'
import { getConnectorById } from '../utils/connector'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  createConnectorFn = evmConnectorFactories.coinbaseWalletSDK()
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
