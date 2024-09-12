import { multicall3Abi, weth9Abi } from 'sushi/abi'
import { publicClientConfig } from 'sushi/config'
import { Token, WNATIVE_ADDRESS } from 'sushi/currency'
import { Address, Hex, createPublicClient } from 'viem'
import {
  CallData,
  MULTICALL3_ADDRESS,
  aggregate3,
} from './multicall3Advanced.js'
import { knownRoutersAbi } from './routerABI/routerAbi.js'

export async function simulateRouteFromNativeThroughWrap(
  from: Address,
  amountIn: bigint,
  tokenTo: Token,
  routerContract: Address,
  routeData: Hex,
): Promise<bigint | string> {
  const chainId = tokenTo.chainId
  const wnative = WNATIVE_ADDRESS[chainId as keyof typeof WNATIVE_ADDRESS]

  let initialOutputBalanceFrom = 0n
  let amountOutFrom = 0n
  let initialOutputBalanceMC = 0n
  let amountOutMC = 0n
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
      action: 'Wrap natives',
      target: wnative,
      abi: weth9Abi,
      functionName: 'deposit',
      value: amountIn,
    },
    {
      action:
        'Approve input tokens from Multicall3 contract to router contract',
      target: wnative,
      functionName: 'approve',
      args: [routerContract, amountIn],
    },
    {
      action: 'Check initial user output balance',
      target: tokenTo,
      functionName: 'balanceOf',
      args: [from],
      validate(value: bigint) {
        initialOutputBalanceFrom = value
        return undefined
      },
    },
    {
      action: 'Check initial multicall contract output balance',
      target: tokenTo,
      functionName: 'balanceOf',
      args: [MULTICALL3_ADDRESS],
      validate(value: bigint) {
        initialOutputBalanceMC = value
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
      args: [from],
      validate(value: bigint) {
        amountOutFrom = value - initialOutputBalanceFrom
        return undefined
      },
    },
    {
      action: 'Check final multicall contract output balance',
      target: tokenTo,
      functionName: 'balanceOf',
      args: [MULTICALL3_ADDRESS],
      validate(value: bigint) {
        amountOutMC = value - initialOutputBalanceMC
        return undefined
      },
    },
  ]

  const res = await aggregate3({
    chainId,
    account: from,
    calls,
    value: amountIn,
    client: createPublicClient(publicClientConfig[chainId]), // DRPC
  })

  return res ?? amountOutFrom + amountOutMC
}
