import { ChainId } from 'sushi'
import { routeProcessor5Abi } from 'sushi/abi'
import { ROUTE_PROCESSOR_5_ADDRESS } from 'sushi/config'
import { Token } from 'sushi/currency'
import { Abi, Address, Hex } from 'viem'
import {
  CallData,
  MULTICALL3_ADDRESS,
  aggregate3,
  ifNetworkSupported,
} from './multicall3Advanced.js'
import { tokenAllowedSlot, tokenBalanceSlot } from './tokenBalanceSlot.js'

function knownRoutersAbi(chainId: ChainId, router: Address): Abi | undefined {
  if (
    router ===
    ROUTE_PROCESSOR_5_ADDRESS[chainId as keyof typeof ROUTE_PROCESSOR_5_ADDRESS]
  )
    return routeProcessor5Abi as Abi
  return
}

export async function simulateRoute(
  from: Address,
  tokenFrom: Token,
  amountIn: bigint,
  tokenTo: Token,
  routerContract: Address,
  routeData: Hex,
): Promise<bigint | string> {
  const chainId = tokenFrom.chainId
  if (!ifNetworkSupported(chainId))
    return `simulateRoute: Network ${chainId} is not supported`
  const slotBalance = tokenBalanceSlot(tokenFrom.address, from)
  if (slotBalance === undefined)
    return `simulateRoute: Unknown balance slot for token ${tokenFrom.symbol}(${tokenFrom.address})`
  const slotAllow = tokenAllowedSlot(
    tokenFrom.address,
    from,
    MULTICALL3_ADDRESS,
  )
  if (slotAllow === undefined)
    return `simulateRoute: Unknown allowance slot for token ${tokenFrom.symbol}(${tokenFrom.address})`

  let initialOutputBalance = 0n
  let amountOut = 0n
  const calls: CallData[] = [
    {
      action: 'Check initial user input balance',
      target: tokenFrom,
      functionName: 'balanceOf',
      args: [from],
      validate(value: bigint) {
        return value === amountIn
          ? undefined
          : `Wrong user initial balance: ${value} instead of ${amountIn}`
      },
    },
    {
      action: 'Check initial user to Multicall3 contract allowance',
      target: tokenFrom,
      functionName: 'allowance',
      args: [from, MULTICALL3_ADDRESS],
      validate(value: bigint) {
        return value >= amountIn
          ? undefined
          : `Wrong user allowance to Multicall3: ${value} < ${amountIn}`
      },
    },
    {
      action: 'Transfer input tokens from user to Multicall3 contract',
      target: tokenFrom,
      functionName: 'transferFrom',
      args: [from, MULTICALL3_ADDRESS, amountIn],
    },
    {
      action:
        'Approve input tokens from Multicall3 contract to router contract',
      target: tokenFrom,
      functionName: 'approve',
      args: [routerContract, amountIn],
    },
    {
      action: 'Check initial user output balance',
      target: tokenTo,
      functionName: 'balanceOf',
      args: [from],
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
    },
    {
      action: 'Check final user output balance',
      target: tokenTo,
      functionName: 'balanceOf',
      args: [from],
      validate(value: bigint) {
        amountOut = value - initialOutputBalance
        return undefined
      },
    },
  ]

  await aggregate3({
    chainId,
    account: from,
    calls,
    stateOverride: [
      {
        address: tokenFrom.address,
        //balance: parseEther('1'),
        stateDiff: [
          {
            slot: slotBalance,
            value: `0x${amountIn.toString(16).padStart(64, '0')}`,
          },
          {
            slot: slotAllow,
            value: `0x${amountIn.toString(16).padStart(64, '0')}`,
          },
        ],
      },
    ],
  })

  return amountOut
}
