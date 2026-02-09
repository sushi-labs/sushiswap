'use client'

import { porto } from '@wagmi/connectors'
import type { CreateConnectorFn } from '@wagmi/core'
import { getConnectorById } from '../utils/connector'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  createConnectorFn = porto()
  return createConnectorFn
}

function getConnector() {
  return getConnectorById('xyz.ithaca.porto')
}

export const getPortoConnector = async () => {
  const connector = getConnector()
  if (connector) {
    return connector
  }

  return await getCreateConnectorFn()
}
