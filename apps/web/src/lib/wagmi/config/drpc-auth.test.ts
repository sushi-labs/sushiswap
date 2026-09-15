import { getRpcHeaders, getRpcUrl } from 'src/lib/rpc'
import { EvmChainId } from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('DRPC_ID', 'server-key')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

async function request(chainId: EvmChainId = EvmChainId.ETHEREUM) {
  const fetch = vi
    .fn()
    .mockResolvedValue(new Response('{"jsonrpc":"2.0","id":1,"result":"0x1"}'))
  vi.stubGlobal('fetch', fetch)
  const { publicTransports, publicChains } = await import('./viem')
  await publicTransports[chainId]({ chain: undefined }).request({
    method: 'eth_chainId',
  })
  return { fetch, publicChains }
}

it('authenticates server clients directly without putting credentials in URLs', async () => {
  const { fetch } = await request()
  expect(fetch).toHaveBeenCalledWith(
    'https://lb.drpc.live/ethereum',
    expect.objectContaining({
      headers: {
        'Content-Type': 'application/json',
        'Drpc-Key': 'server-key',
      },
    }),
  )
})

it('routes browser and Privy clients through the current origin without credentials', async () => {
  vi.stubGlobal('window', { location: { origin: 'https://preview.sushi.com' } })
  const { fetch, publicChains } = await request()
  const url = 'https://preview.sushi.com/api/rpc/ethereum'
  expect(fetch).toHaveBeenCalledWith(
    url,
    expect.objectContaining({
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  expect(
    publicChains.find((chain) => chain.id === EvmChainId.ETHEREUM)?.rpcUrls
      .privyWalletOverride.http,
  ).toEqual([url])
  expect(getRpcHeaders()).toEqual({})
  expect(getRpcUrl('solana')).toBe('https://preview.sushi.com/api/rpc/solana')
  expect(getRpcUrl('stellar')).toBe('https://preview.sushi.com/api/rpc/stellar')
})

it('leaves non-DRPC transports unauthenticated', async () => {
  const { fetch } = await request(EvmChainId.BTTC)
  expect(fetch).toHaveBeenCalledWith(
    'https://rpc.bittorrentchain.io/',
    expect.objectContaining({
      headers: { 'Content-Type': 'application/json' },
    }),
  )
})
