import { ChainId } from 'sushi'
import * as z from 'zod'
import { NEAR_INTENTS_API_URL, type NearIntentsChainId } from '../config'
import { nearIntentsTokenSchema } from './schema'

const NEAR_CHAIN_TO_CHAIN_ID = {
  eth: ChainId.ETHEREUM,
  base: ChainId.BASE,
  arb: ChainId.ARBITRUM,
  gnosis: ChainId.GNOSIS,
  bera: ChainId.BERACHAIN,
  bsc: ChainId.BSC,
  pol: ChainId.POLYGON,
  op: ChainId.OPTIMISM,
  avax: ChainId.AVALANCHE,
  xlayer: ChainId.XLAYER,
  monad: ChainId.MONAD,
  plasma: ChainId.PLASMA,
  stellar: ChainId.STELLAR,
} as const

interface NearIntentsToken
  extends Omit<z.infer<typeof nearIntentsTokenSchema>, 'blockchain'> {
  chainId: NearIntentsChainId
}

export const getNearIntentsTokens = async () => {
  const response = await fetch(`${NEAR_INTENTS_API_URL}/v0/tokens`)
  const tokens = z.array(nearIntentsTokenSchema).parse(await response.json())

  const filtered = tokens.flatMap(({ blockchain, ...token }) => {
    const chainId =
      NEAR_CHAIN_TO_CHAIN_ID[blockchain as keyof typeof NEAR_CHAIN_TO_CHAIN_ID]
    if (!chainId) return []

    return {
      ...token,
      chainId,
      contractAddress: token.contractAddress ?? 'NATIVE',
    }
  })

  return filtered.reduce(
    (accum, token) => {
      if (!accum[token.chainId]) {
        accum[token.chainId] = {}
      }

      accum[token.chainId][token.contractAddress] = token

      return accum
    },
    {} as Record<NearIntentsChainId, Record<string, NearIntentsToken>>,
  )
}
