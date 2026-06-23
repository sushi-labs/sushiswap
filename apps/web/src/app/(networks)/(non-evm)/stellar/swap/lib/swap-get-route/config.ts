import {
  STELLAR_EURC,
  STELLAR_PYUSD,
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  type StellarContractAddress,
} from 'sushi/stellar'

const BASE_POOL_GRAPH_TOKENS = [
  STELLAR_XLM[StellarChainId.STELLAR],
  STELLAR_USDC[StellarChainId.STELLAR],
  STELLAR_EURC[StellarChainId.STELLAR],
  STELLAR_PYUSD[StellarChainId.STELLAR],
] as const

export const BASE_POOL_GRAPH_TOKEN_ADDRESSES = BASE_POOL_GRAPH_TOKENS.map(
  (token) => token.address,
) satisfies readonly StellarContractAddress[]
