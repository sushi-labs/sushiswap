import { ChainId } from '@sushiswap/chain'
import { Amount, Type } from '@sushiswap/currency'
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem'

export const SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.AVALANCHE,
] as const

export type SushiXSwap2ChainId = (typeof SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS)[number]

export const SUSHIXSWAP_2_ADDRESS: Record<SushiXSwap2ChainId, `0x${string}`> = {
  [ChainId.ARBITRUM]: '0xec4a1bf5738841456054bd720bedf18be2e3f8f0',
  [ChainId.OPTIMISM]: '0xd9d93d4daa6656b13dbc1997a0c543ac86ff2690',
  [ChainId.POLYGON]: '0xc45a496bcc9ba69ffb45303f7515739c3f6ff921',
  [ChainId.BSC]: '0xdd9c6c40171ea2dfc31ed00b0a58be2c8a3c7971',
  [ChainId.ETHEREUM]: '0xd294d0d26ef0ff2087a35616b7aada083c53640f',
  [ChainId.AVALANCHE]: '0xfec47ce995b4f3c0e42ef4d477150313a4d22211',
} as const

export const isSushiXSwap2ChainId = (chainId: number) => chainId in SUSHIXSWAP_2_ADDRESS

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

type ProcessRouteInput = [Address, bigint, Address, bigint, Address, `0x${string}`]

export function encodeSwapData([tokenIn, amountIn, tokenOut, amountOut, to, route]: ProcessRouteInput) {
  return encodeAbiParameters(
    parseAbiParameters(
      '(address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut, address to, bytes route)'
    ),
    [{ tokenIn, amountIn, tokenOut, amountOut, to, route }]
  )
}

export * from './adapters'
