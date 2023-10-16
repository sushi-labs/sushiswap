import type { ChainProviderFn } from '@wagmi/core'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
import { publicProvider } from '@wagmi/core/providers/public'

const alchemyId =
  process.env['ALCHEMY_ID'] || process.env['NEXT_PUBLIC_ALCHEMY_ID']
// const infuraId = process.env['INFURA_ID'] || process.env['NEXT_PUBLIC_INFURA_ID']

if (!alchemyId) {
  throw Error('NO ALCHEMY ID SET')
}

export const allProviders: ChainProviderFn[] = [
  alchemyProvider({
    apiKey: alchemyId as string,
  }),
  // infuraProvider({ infuraId }),
  publicProvider(),
]
