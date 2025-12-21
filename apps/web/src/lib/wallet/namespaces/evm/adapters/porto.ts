'use client'

import type { CreateConnectorFn } from '@wagmi/core'
import { getConnectorById } from '../utils/connector'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  const [{ porto }] = await Promise.all([
    import('@wagmi/connectors'),
    import('porto'),
  ])

  createConnectorFn = porto()
  return createConnectorFn
}

function getConnector() {
  return getConnectorById('porto')
}

export const getPortoConnector = async () => {
  const connector = getConnector()
  if (connector) {
    return connector
  }

  return await getCreateConnectorFn()
}
