'use client'

import type { CreateConnectorFn } from '@wagmi/core'
import { getConnectorById } from '../utils/connector'
import { safeConnectorDefinition } from './safe-definition'

let createConnectorFn: CreateConnectorFn | undefined

async function getCreateConnectorFn() {
  if (createConnectorFn) return createConnectorFn

  createConnectorFn = await safeConnectorDefinition.load()
  return createConnectorFn
}

function getConnector() {
  return getConnectorById(safeConnectorDefinition.id)
}

export const getSafeConnector = async () => {
  const connector = getConnector()
  if (connector) {
    return connector
  }

  return await getCreateConnectorFn()
}

export async function isSafeAppAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    const { default: SafeAppsSDK } = await import('@safe-global/safe-apps-sdk')
    const sdk = new SafeAppsSDK()

    // In a Safe iframe this resolves with safe info; outside it typically rejects/throws.
    await sdk.safe.getInfo()
    return true
  } catch {
    return false
  }
}
