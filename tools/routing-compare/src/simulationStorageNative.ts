import { multicall3Abi } from 'sushi/abi'
import { Token } from 'sushi/currency'
import { Address, Hex } from 'viem'
import {
  CallData,
  MULTICALL3_ADDRESS,
  aggregate3,
  ifNetworkSupported,
} from './multicall3Advanced.js'
import { knownRoutersAbi } from './routerABI/routerAbi.js'

export async function simulateRouteFromNative(
  from: Address,
  amountIn: bigint,
  tokenTo: Token,
  routerContract: Address,
  routeData: Hex,
): Promise<bigint | string> {
  const chainId = tokenTo.chainId
  if (!ifNetworkSupported(chainId))
    return `simulateRoute: Network ${chainId} is not supported`

  let initialOutputBalance = 0n
  let amountOut = 0n
  const calls: CallData[] = [
    {
      action: 'Check initial user input balance',
      target: MULTICALL3_ADDRESS,
      abi: multicall3Abi,
      functionName: 'getEthBalance',
      args: [from],
      validate(value: bigint) {
        return value >= amountIn
          ? undefined
          : `Insufficient user initial balance: ${value} < ${amountIn}`
      },
    },
    {
      action: 'Check initial user output balance',
      target: tokenTo,
      functionName: 'balanceOf',
      args: [MULTICALL3_ADDRESS],
      validate(value: bigint) {
        initialOutputBalance = value
        return undefined
      },
    },
    {
      action: 'Call router',
      target: routerContract,
      abi: knownRoutersAbi(chainId, routerContract),
      callData: routeData,
      value: amountIn,
    },
    {
      action: 'Check final user output balance',
      target: tokenTo,
      functionName: 'balanceOf',
      args: [MULTICALL3_ADDRESS],
      validate(value: bigint) {
        amountOut = value - initialOutputBalance
        return undefined
      },
    },
  ]

  const res = await aggregate3({
    chainId,
    account: from,
    calls,
    value: amountIn,
  })

  return res ?? amountOut
}
