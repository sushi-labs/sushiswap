import type {
  CreateConnectorFn,
  Connector as WagmiConnector,
} from '@wagmi/core'

type LoadedConnector = ReturnType<CreateConnectorFn>

export type LazyConnectorDefinition = {
  id: string
  load: () => Promise<CreateConnectorFn>
  name: string
  type: string
}

export function withConnectorSetupErrorLogging(
  connectorFn: CreateConnectorFn,
  connectorName: string,
): CreateConnectorFn {
  return (config) => {
    const connector = connectorFn(config)
    const setup = connector.setup

    return {
      ...connector,
      async setup() {
        try {
          await setup?.call(this)
        } catch (error) {
          console.error(`Failed to set up ${connectorName} connector`, error)
        }
      },
    }
  }
}

export function createLazyConnector({
  id,
  load,
  name,
  type,
}: LazyConnectorDefinition): CreateConnectorFn {
  return (config) => {
    let connectorPromise: Promise<LoadedConnector> | undefined
    let connectorContext: WagmiConnector | undefined

    function initializeConnector(connector: LoadedConnector): LoadedConnector {
      if (!connectorContext) return connector
      return Object.assign(connector, {
        emitter: connectorContext.emitter,
        uid: connectorContext.uid,
      })
    }

    function getConnector(): Promise<LoadedConnector> {
      connectorPromise ??= load()
        .then((connectorFn) => initializeConnector(connectorFn(config)))
        .catch((error: unknown) => {
          connectorPromise = undefined
          throw error
        })
      return connectorPromise
    }

    function forwardEvent(
      callback: (connector: LoadedConnector) => void,
    ): void {
      void getConnector().then(callback).catch(reportError)
    }

    function reportError(error: unknown): void {
      console.error(`Failed to load ${name} connector`, error)
    }

    return {
      id,
      name,
      type,
      async setup(this: WagmiConnector) {
        connectorContext = this
        try {
          const connector = await getConnector()
          await connector.setup?.()
        } catch (error) {
          reportError(error)
        }
      },
      async connect(parameters) {
        const connector = await getConnector()
        return connector.connect(parameters)
      },
      async disconnect() {
        const connector = await getConnector()
        return connector.disconnect()
      },
      async getAccounts() {
        const connector = await getConnector()
        return connector.getAccounts()
      },
      async getChainId() {
        const connector = await getConnector()
        return connector.getChainId()
      },
      // Do not declare optional `getClient` here. Wagmi checks for its
      // presence and otherwise builds the connector client from `getProvider`.
      async getProvider(parameters) {
        const connector = await getConnector()
        return connector.getProvider(parameters)
      },
      async isAuthorized() {
        const connector = await getConnector()
        return connector.isAuthorized()
      },
      async switchChain(parameters) {
        const connector = await getConnector()
        if (!connector.switchChain) {
          throw new Error(`${name} connector cannot switch chains`)
        }
        return connector.switchChain(parameters)
      },
      onAccountsChanged(accounts) {
        forwardEvent((connector) => connector.onAccountsChanged(accounts))
      },
      onChainChanged(chainId) {
        forwardEvent((connector) => connector.onChainChanged(chainId))
      },
      onConnect(connectInfo) {
        forwardEvent((connector) => connector.onConnect?.(connectInfo))
      },
      onDisconnect(error) {
        forwardEvent((connector) => connector.onDisconnect(error))
      },
      onMessage(message) {
        forwardEvent((connector) => connector.onMessage?.(message))
      },
    }
  }
}
