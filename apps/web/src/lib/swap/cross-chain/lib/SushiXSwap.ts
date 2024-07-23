import { sushiXSwap2Abi } from 'sushi/abi'
import { Amount, Type } from 'sushi/currency'
import {
  Address,
  Hex,
  WriteContractParameters,
  encodeAbiParameters,
  parseAbiParameters,
} from 'viem'
import { SuccessfulTradeReturn } from '../actions/getTrade'

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

export enum SushiXSwapFunctionName {
  Bridge = 'bridge',
  SwapAndBridge = 'swapAndBridge',
}

export type SushiXSwapWriteArgs =
  | WriteContractParameters<
      typeof sushiXSwap2Abi,
      SushiXSwapFunctionName.Bridge
    >['args']
  | WriteContractParameters<
      typeof sushiXSwap2Abi,
      SushiXSwapFunctionName.SwapAndBridge
    >['args']

interface BridgeParams {
  refId: string
  adapter: string
  tokenIn: string
  amountIn: Parameters<typeof BigInt>[0]
  to: string
  adapterData: string
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
