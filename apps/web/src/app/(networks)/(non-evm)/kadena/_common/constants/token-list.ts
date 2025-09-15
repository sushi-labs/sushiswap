import { KvmChainId, KvmToken } from 'sushi/kvm'
import { KADENA_TOKEN_IMAGE_BASE_URL } from '../lib/hooks/use-base-tokens'
import { KADENA_CHAIN_ID, KADENA_NETWORK_ID } from './network'

export const KADENA = new KvmToken({
  chainId: KvmChainId.KADENA,
  address: 'coin',
  symbol: 'KDA',
  decimals: 12,
  name: 'Kadena',
  metadata: {
    imageUrl: `${KADENA_TOKEN_IMAGE_BASE_URL}img/kda.svg`,
    validated: true,
    kadenaChainId: KADENA_CHAIN_ID,
    kadenaNetworkId: KADENA_NETWORK_ID,
  },
})

export const COMMON_KADENA_TOKENS: KvmToken[] = [
  KADENA,
  new KvmToken({
    chainId: KvmChainId.KADENA,
    address: 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.kb-ETH',
    name: 'Kinesis Bridged ETH',
    symbol: 'kb-ETH',
    decimals: 18,
    metadata: {
      imageUrl: `${KADENA_TOKEN_IMAGE_BASE_URL}img/kb-eth.svg`,
      validated: true,
      kadenaChainId: KADENA_CHAIN_ID,
      kadenaNetworkId: KADENA_NETWORK_ID,
    },
  }),
  new KvmToken({
    chainId: KvmChainId.KADENA,
    address: 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.kb-USDC',
    name: 'Kinesis Bridged USDC',
    symbol: 'kb-USDC',
    decimals: 6,
    metadata: {
      imageUrl: `${KADENA_TOKEN_IMAGE_BASE_URL}img/kb-usdc.svg`,
      validated: true,
      kadenaChainId: KADENA_CHAIN_ID,
      kadenaNetworkId: KADENA_NETWORK_ID,
    },
  }),
]

export const STABLE_TOKENS = COMMON_KADENA_TOKENS.filter(
  (token) => token.symbol === 'kb-USDC',
)
