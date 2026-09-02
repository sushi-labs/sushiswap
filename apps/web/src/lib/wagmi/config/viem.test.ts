import { evmChains } from 'sushi/evm'
import { describe, expect, test } from 'vitest'
import { publicChains, publicTransports } from './viem'

describe('publicChains', () => {
  test.each(publicChains)(
    'exposes unmodified chain metadata for $name',
    (chain) => {
      const sourceChain = evmChains.find(
        ({ viemChain }) => viemChain.id === chain.id,
      )?.viemChain

      expect(chain.rpcUrls).toEqual(sourceChain?.rpcUrls)
      // Sushi's dRPC endpoint requires an `Authorization` JWT that only its own
      // transports attach. Privy creates its own viem clients without one, so
      // it must never be handed this URL as a chain RPC.
      expect(JSON.stringify(chain.rpcUrls)).not.toContain('lb.drpc.live')
    },
  )

  test('keeps the authenticated dRPC endpoints in the transports only', () => {
    const transportUrls = publicChains.map(
      (chain) => publicTransports[chain.id]({ chain: undefined }).value?.url,
    )

    expect(transportUrls.some((url) => url?.includes('lb.drpc.live'))).toBe(
      true,
    )
  })
})
