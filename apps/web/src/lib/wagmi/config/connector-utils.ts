import type { CreateConnectorFn } from '@wagmi/core'

type Connector = ReturnType<CreateConnectorFn>

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
    let connectorPromise: Promise<Connector> | undefined

    function getConnector(): Promise<Connector> {
      connectorPromise ??= load().then((connectorFn) => connectorFn(config))
      return connectorPromise
    }

    function forwardEvent(callback: (connector: Connector) => void): void {
      void getConnector().then(callback).catch(reportError)
    }

    function reportError(error: unknown): void {
      console.error(`Failed to load ${name} connector`, error)
    }

    return {
      id,
      name,
      type,
      async setup() {
        try {
          const connector = await getConnector()
          await connector.setup?.call(this)
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
      async getClient(parameters) {
        const connector = await getConnector()
        if (!connector.getClient) {
          throw new Error(`${name} connector does not provide a client`)
        }
        return connector.getClient(parameters)
      },
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
