import { EvmChainId, SUSHI } from 'sushi/evm'

export const BUYBACK_RESERVE_PARAMS = {
  walletAddress: '0x33d785012eeCaB254700988E988048E044baC4F5',
  chainId: 1,
  tokenAddress: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
} as const

export const BUYBACK_TOKEN = SUSHI[EvmChainId.ETHEREUM]
