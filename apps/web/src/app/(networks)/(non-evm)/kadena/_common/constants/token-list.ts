import type { KadenaToken } from '~kadena/_common/types/token-type'
import { KADENA_TOKEN_IMAGE_BASE_URL } from '../lib/hooks/use-base-tokens'

export const KADENA: KadenaToken = {
  tokenAddress: 'coin',
  tokenSymbol: 'KDA',
  tokenDecimals: 12,
  tokenName: 'Kadena',
  tokenImage: `${KADENA_TOKEN_IMAGE_BASE_URL}img/kda.svg`,
  validated: true,
}

export const COMMON_KADENA_TOKENS: KadenaToken[] = [
  KADENA,
  {
    tokenAddress: 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.kb-ETH',
    isNative: false,
    tokenName: 'Kinesis Bridged ETH',
    tokenSymbol: 'kb-ETH',
    tokenDecimals: 18,
    tokenImage: `${KADENA_TOKEN_IMAGE_BASE_URL}img/kb-eth.svg`,
    validated: true,
  },
  {
    tokenAddress: 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.kb-USDC',
    isNative: false,
    tokenName: 'Kinesis Bridged USDC',
    tokenSymbol: 'kb-USDC',
    tokenDecimals: 6,
    tokenImage: `${KADENA_TOKEN_IMAGE_BASE_URL}img/kb-usdc.svg`,
    validated: true,
  },
]

export const STABLE_TOKENS = COMMON_KADENA_TOKENS.filter(
  (token) => token.tokenSymbol === 'kb-USDC',
)
