import { evmChains } from 'sushi/evm'
import { describe, expect, test } from 'vitest'
import { publicChains, publicTransports } from './viem'

describe('publicChains', () => {
  test.each(publicChains)(
    'preserves public chain metadata and overrides only Privy for $name',
    (chain) => {
      const sourceChain = evmChains.find(
        ({ viemChain }) => viemChain.id === chain.id,
      )?.viemChain
      const transportUrl = publicTransports[chain.id]({
        chain: undefined,
      }).value?.url

      expect(chain.rpcUrls.default).toEqual(sourceChain?.rpcUrls.default)
      expect(chain.rpcUrls.privyWalletOverride?.http).toEqual([transportUrl])
    },
  )
})
