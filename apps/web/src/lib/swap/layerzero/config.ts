import { EvmChainId } from 'sushi/evm'
import { STELLAR_USDT0_ADDRESS, StellarChainId } from 'sushi/stellar'

// Native USDT0 deployments on chains already supported by the Stellar xSwap UI.
// https://docs.usdt0.to/technical-documentation/deployments
export const LAYERZERO_USDT0_EVM_DEPLOYMENTS = {
  [EvmChainId.ETHEREUM]: {
    eid: 30101,
    tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    oftAddress: '0x6C96dE32CEa08842dcc4058c14d3aaAD7Fa41dee',
    symbol: 'USDT',
    approvalRequired: true,
  },
  [EvmChainId.OPTIMISM]: {
    eid: 30111,
    tokenAddress: '0x01bFF41798a0BcF287b996046Ca68b395DbC1071',
    oftAddress: '0xF03b4d9AC1D5d1E7c4cEf54C2A313b9fe051A0aD',
    symbol: 'USDT0',
    approvalRequired: false,
  },
  [EvmChainId.POLYGON]: {
    eid: 30109,
    tokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    oftAddress: '0x6BA10300f0DC58B7a1e4c0e41f5daBb7D7829e13',
    symbol: 'USDT0',
    approvalRequired: false,
  },
  [EvmChainId.MONAD]: {
    eid: 30390,
    tokenAddress: '0xe7cd86e13AC4309349F30B3435a9d337750fC82D',
    oftAddress: '0x9151434b16b9763660705744891fA906F660EcC5',
    symbol: 'USDT0',
    approvalRequired: false,
  },
  [EvmChainId.BERACHAIN]: {
    eid: 30362,
    tokenAddress: '0x779Ded0c9e1022225f8E0630b35a9b54bE713736',
    oftAddress: '0x3Dc96399109df5ceb2C226664A086140bD0379cB',
    symbol: 'USDT0',
    approvalRequired: false,
  },
  [EvmChainId.PLASMA]: {
    eid: 30383,
    tokenAddress: '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb',
    oftAddress: '0x02ca37966753bDdDf11216B73B16C1dE756A7CF9',
    symbol: 'USDT0',
    approvalRequired: false,
  },
  [EvmChainId.ARBITRUM]: {
    eid: 30110,
    tokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    oftAddress: '0x14E4A1B13bf7F943c8ff7C51fb60FA964A298D92',
    symbol: 'USDT0',
    approvalRequired: false,
  },
} as const

export type LayerZeroEvmChainId = keyof typeof LAYERZERO_USDT0_EVM_DEPLOYMENTS
export type LayerZeroChainId =
  | LayerZeroEvmChainId
  | typeof StellarChainId.STELLAR

export const LAYERZERO_STELLAR_EID = 30600
export const LAYERZERO_STELLAR_OFT_ADDRESS =
  'CBOWOLFSDM5PZXNFIVDMP5NZ7U2GSIHED6H6R446QOHF266XINKUMMF6'
export const LAYERZERO_SUPPORTED_CHAIN_IDS = [
  EvmChainId.ETHEREUM,
  EvmChainId.OPTIMISM,
  EvmChainId.POLYGON,
  EvmChainId.MONAD,
  EvmChainId.BERACHAIN,
  EvmChainId.PLASMA,
  EvmChainId.ARBITRUM,
  StellarChainId.STELLAR,
] as const

export function isLayerZeroEvmChainId(
  chainId: number,
): chainId is LayerZeroEvmChainId {
  return Object.hasOwn(LAYERZERO_USDT0_EVM_DEPLOYMENTS, chainId)
}

export function isLayerZeroChainId(
  chainId: number,
): chainId is LayerZeroChainId {
  return chainId === StellarChainId.STELLAR || isLayerZeroEvmChainId(chainId)
}

export function isLayerZeroTransferPair(
  fromChainId: LayerZeroChainId,
  toChainId: LayerZeroChainId,
): boolean {
  return (
    fromChainId !== toChainId &&
    (fromChainId === StellarChainId.STELLAR ||
      toChainId === StellarChainId.STELLAR)
  )
}

export function getLayerZeroTokenAddress(chainId: LayerZeroChainId): string {
  return chainId === StellarChainId.STELLAR
    ? STELLAR_USDT0_ADDRESS[StellarChainId.STELLAR]
    : LAYERZERO_USDT0_EVM_DEPLOYMENTS[chainId].tokenAddress.toLowerCase()
}

export function isLayerZeroTokenParam(
  chainId: LayerZeroChainId,
  tokenParam: string | undefined,
): boolean {
  if (!tokenParam) return false
  const address = getLayerZeroTokenAddress(chainId)
  return chainId === StellarChainId.STELLAR
    ? tokenParam === address
    : tokenParam.toLowerCase() === address.toLowerCase()
}

export function isLayerZeroUsdt0Route(
  chainId0: number,
  chainId1: number,
  token0Param?: string,
  token1Param?: string,
): boolean {
  if (!isLayerZeroChainId(chainId0) || !isLayerZeroChainId(chainId1)) {
    return false
  }
  if (!isLayerZeroTransferPair(chainId0, chainId1)) return false
  if (chainId0 === StellarChainId.STELLAR) {
    return (
      isLayerZeroTokenParam(chainId0, token0Param) &&
      (!token1Param || isLayerZeroTokenParam(chainId1, token1Param))
    )
  }
  return (
    chainId1 === StellarChainId.STELLAR &&
    isLayerZeroTokenParam(chainId1, token1Param) &&
    (!token0Param || isLayerZeroTokenParam(chainId0, token0Param))
  )
}

export function getLayerZeroEid(chainId: LayerZeroChainId): number {
  return chainId === StellarChainId.STELLAR
    ? LAYERZERO_STELLAR_EID
    : LAYERZERO_USDT0_EVM_DEPLOYMENTS[chainId].eid
}

export function getLayerZeroDecimals(chainId: LayerZeroChainId): number {
  return chainId === StellarChainId.STELLAR ? 7 : 6
}
