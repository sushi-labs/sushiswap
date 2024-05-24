import { NativeAddress } from '@sushiswap/react-query'
import { Amount, Token, Type } from 'sushi/currency'
import { RToken } from 'sushi/tines'
import { Address, Hex, encodeAbiParameters, parseAbiParameters } from 'viem'
import { type SuccessfulTradeReturn } from '../actions/getTrade'

interface BridgeParams {
  refId: string
  adapter: string
  tokenIn: string
  amountIn: Parameters<typeof BigInt>[0]
  to: string
  adapterData: string
}

export enum SushiXSwap2Adapter {
  Stargate = 'Stargate',
  Squid = 'Squid',
}

export enum SushiXSwapTransactionType {
  Bridge = 'Bridge',
  SwapAndBridge = 'SwapAndBridge',
  BridgeAndSwap = 'BridgeAndSwap',
  CrossChainSwap = 'CrossChainSwap',
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
    tokenIn: amountIn.currency.isNative
      ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      : amountIn.currency.address,
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
  return encodeAbiParameters(parseAbiParameters('address, uint256, bytes'), [
    target,
    gasLimit,
    targetData,
  ])
}

type ProcessRouteInput = readonly [
  Address,
  bigint,
  Address,
  bigint,
  Address,
  `0x${string}`,
]

export function encodeSwapData([
  tokenIn,
  amountIn,
  tokenOut,
  amountOut,
  to,
  route,
]: ProcessRouteInput) {
  return encodeAbiParameters(
    parseAbiParameters(
      '(address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut, address to, bytes route)',
    ),
    [{ tokenIn, amountIn, tokenOut, amountOut, to, route }],
  )
}

export function encodeRouteProcessorArgs({
  tokenIn,
  amountIn,
  tokenOut,
  amountOutMin,
  to,
  routeCode,
}: NonNullable<SuccessfulTradeReturn['routeProcessorArgs']>) {
  return encodeAbiParameters(
    parseAbiParameters(
      '(address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut, address to, bytes route)',
    ),
    [
      {
        tokenIn: tokenIn as Address,
        amountIn: BigInt(amountIn),
        tokenOut: tokenOut as Address,
        amountOut: BigInt(amountOutMin),
        to: to as Address,
        route: routeCode as Hex,
      },
    ],
  )
}

export function tokenToRToken(t: Type): RToken {
  if (t instanceof Token) return t as RToken
  const nativeRToken: RToken = {
    address: NativeAddress,
    name: t.name,
    symbol: t.symbol,
    chainId: t.chainId,
    decimals: 18,
  }
  return nativeRToken
}

export * from './adapters'
