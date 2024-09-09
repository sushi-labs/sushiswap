import { sushiXSwap2Abi_bridge, sushiXSwap2Abi_swapAndBridge } from 'sushi/abi'
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

export type SushiXSwapWriteArgsBridge = WriteContractParameters<
  typeof sushiXSwap2Abi_bridge,
  SushiXSwapFunctionName.Bridge
>['args']

export type SushiXSwapWriteArgsSwapAndBridge = WriteContractParameters<
  typeof sushiXSwap2Abi_swapAndBridge,
  SushiXSwapFunctionName.SwapAndBridge
>['args']

export type SushiXSwapWriteArgs =
  | SushiXSwapWriteArgsBridge
  | SushiXSwapWriteArgsSwapAndBridge

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
