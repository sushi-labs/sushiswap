import { describe, expect, test } from 'vitest'
import { publicChains, publicTransports } from './viem'

describe('publicChains', () => {
  test.each(publicChains)(
    'uses the configured transport for $name chain metadata and Privy',
    (chain) => {
      const transportUrl = publicTransports[chain.id]({
        chain: undefined,
      }).value?.url

      expect(chain.rpcUrls.default.http).toEqual([transportUrl])
      expect(chain.rpcUrls.privyWalletOverride?.http).toEqual([transportUrl])
    },
  )
})
