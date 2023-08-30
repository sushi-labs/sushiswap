import { Amount, Type } from '@sushiswap/currency'
import { BigintIsh } from '@sushiswap/math'
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem'

interface BridgeParams {
  refId: string
  adapter: string
  tokenIn: string
  amountIn: BigintIsh
  to: string
  adapterData: string
}

export enum SushiXSwapV2Adapter {
  Stargate = 0,
}

export enum TransactionType {
  Bridge = 0,
  SwapAndBridge = 1,
  BridgeAndSwap = 2,
  CrossChainSwap = 3,
}

const NativeAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const getTokenAddress = (currency: Type) => (currency.isNative ? NativeAddress : currency.address)

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
    tokenIn: getTokenAddress(amountIn.currency),
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

export type ProcessRouteInput = [Address, bigint, Address, bigint, Address, `0x${string}`]

export function encodeSwapData([tokenIn, amountIn, tokenOut, amountOut, to, route]: ProcessRouteInput) {
  return encodeAbiParameters(
    parseAbiParameters(
      '(address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut, address to, bytes route)'
    ),
    [{ tokenIn, amountIn, tokenOut, amountOut, to, route }]
  )
}
