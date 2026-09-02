'use client'

import { type Connector, getConnectors, injected } from '@wagmi/core'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { isPrivyEvmConnector } from 'src/lib/wallet/privy/privy-evm-connector'

function getConnector(uid: string | undefined) {
  const connectors = getConnectors(getWagmiConfig())
  if (uid) {
    return connectors.find((connector) => connector.uid === uid)
  } else {
    return connectors.find((connector) => isInjectedConnector(connector))
  }
}

export const getInjectedConnector = async (ctx?: {
  uid: string | undefined
}) => {
  const uid = ctx?.uid
  const connector = getConnector(uid)
  if (connector) {
    return connector
  }

  return injected()
}

export function isInjectedConnector(connector: Connector) {
  return (
    !isPrivyEvmConnector(connector) &&
    (connector.type === 'injected' ||
      connector.id === 'injected' ||
      connector.name.toLowerCase().includes('injected'))
  )
}
