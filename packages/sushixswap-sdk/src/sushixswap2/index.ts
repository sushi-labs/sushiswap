import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem'

export const SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.BSC,
  ChainId.AVALANCHE,
  ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.BASE,
] as const

export type SushiXSwap2ChainId = (typeof SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS)[number]

export const SUSHIXSWAP_2_ADDRESS: Record<SushiXSwap2ChainId, `0x${string}`> = {
  [ChainId.ETHEREUM]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.BSC]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.AVALANCHE]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.POLYGON]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.ARBITRUM]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.OPTIMISM]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
  [ChainId.BASE]: '0x804b526e5bf4349819fe2db65349d0825870f8ee',
} as const

export const isSushiXSwap2ChainId = (chainId: ChainId): chainId is SushiXSwap2ChainId =>
  SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS.includes(chainId as SushiXSwap2ChainId)

interface BridgeParams {
  refId: string
  adapter: string
  tokenIn: string
  amountIn: Parameters<typeof BigInt>[0]
  to: string
  adapterData: string
}

export enum SushiXSwap2Adapter {
  Stargate = 0,
}

export enum TransactionType {
  Bridge = 0,
  SwapAndBridge = 1,
  BridgeAndSwap = 2,
  CrossChainSwap = 3,
}

export const getBridgeParams = ({
  refId = '0x0000',
  adapter,
  amountIn,
  to,
  adapterData,
}: {
  refId?: string
  adapter: string
  amountIn: Amount<Type>
  to: string
  adapterData: string
}): BridgeParams => {
  return {
    refId,
    adapter,
    tokenIn: amountIn.currency.isNative ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : amountIn.currency.address,
    amountIn: amountIn.quotient.toString(),
    to,
    adapterData,
  }
}

export const encodePayloadData = ({
  target,
  gasLimit,
  targetData,
}: {
  target: Address
  gasLimit: bigint
  targetData: `0x${string}`
}) => {
  return encodeAbiParameters(parseAbiParameters('address, uint256, bytes'), [target, gasLimit, targetData])
}

type ProcessRouteInput = readonly [Address, bigint, Address, bigint, Address, `0x${string}`]

export function encodeSwapData([tokenIn, amountIn, tokenOut, amountOut, to, route]: ProcessRouteInput) {
  return encodeAbiParameters(
    parseAbiParameters(
      '(address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut, address to, bytes route)'
    ),
    [{ tokenIn, amountIn, tokenOut, amountOut, to, route }]
  )
}

export * from './adapters'
