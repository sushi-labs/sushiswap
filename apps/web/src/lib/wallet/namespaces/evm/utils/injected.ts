import type { Connector } from '@wagmi/core'

export function isInjectedConnector(connector: Connector) {
  return (
    connector.type === 'injected' ||
    connector.id === 'injected' ||
    connector.name.toLowerCase().includes('injected')
  )
}
