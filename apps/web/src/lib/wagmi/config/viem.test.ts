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
      // Privy builds its own viem clients from this override and passes them no
      // fetch options; `patches/viem@2.55.0.patch` supplies the dRPC JWT they
      // need. See `drpc-auth.test.ts`.
      expect(chain.rpcUrls.privyWalletOverride?.http).toEqual([transportUrl])
    },
  )
})
