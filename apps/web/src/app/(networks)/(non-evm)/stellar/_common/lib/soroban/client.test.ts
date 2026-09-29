import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => vi.unstubAllGlobals())

it.each(['http://localhost:3000', 'https://preview.sushi.com'])(
  'constructs Stellar SDK clients for the proxy on %s',
  async (origin) => {
    vi.resetModules()
    vi.stubGlobal('window', { location: { origin } })
    const {
      SorobanClient,
      getFactoryContractClient,
      getRouterContractClient,
      getPoolContractClient,
      getPoolLensContractClient,
      getTokenContractClient,
      getPositionManagerContractClient,
      getZapRouterContractClient,
    } = await import('./client')
    const rpcUrl = `${origin}/api/rpc/stellar`

    expect(SorobanClient.serverURL.href).toBe(rpcUrl)
    for (const getClient of [
      getFactoryContractClient,
      getRouterContractClient,
      getPoolContractClient,
      getPoolLensContractClient,
      getTokenContractClient,
      getPositionManagerContractClient,
      getZapRouterContractClient,
    ]) {
      const client = getClient({
        contractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM',
      })
      expect(client.options.server?.serverURL.href).toBe(rpcUrl)
    }
  },
)
