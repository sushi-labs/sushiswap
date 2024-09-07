import { ChainId } from 'sushi'
import { erc20Abi, multicall3Abi, routeProcessor5Abi } from 'sushi/abi'
import { ROUTE_PROCESSOR_5_ADDRESS, publicClientConfig } from 'sushi/config'
import { Token } from 'sushi/currency'
import {
  http,
  Abi,
  Address,
  Hex,
  createPublicClient,
  decodeErrorResult,
  decodeFunctionResult,
  encodeFunctionData,
} from 'viem'
import { tokenAllowedSlot, tokenBalanceSlot } from './tokenBalanceSlot.js'

const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'

const ALCHEMY_ENTRY_POINTS: Record<number, string> = {
  [ChainId.ETHEREUM]: 'https://eth-mainnet.g.alchemy.com/v2/',
  [ChainId.POLYGON]: 'https://polygon-mainnet.g.alchemy.com/v2/',
  [ChainId.POLYGON_ZKEVM]: 'https://polygonzkevm-mainnet.g.alchemy.com/v2',
  [ChainId.ARBITRUM]: 'https://arb-mainnet.g.alchemy.com/v2/',
  [ChainId.OPTIMISM]: 'https://opt-mainnet.g.alchemy.com/v2/',
  [ChainId.BASE]: 'https://base-mainnet.g.alchemy.com/v2/',
}
//`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`

export function ifNetworkSupported(chainId: ChainId) {
  return ALCHEMY_ENTRY_POINTS[chainId] !== undefined
}

function knownRoutersAbi(chainId: ChainId, router: Address): Abi | undefined {
  if (
    router ===
    ROUTE_PROCESSOR_5_ADDRESS[chainId as keyof typeof ROUTE_PROCESSOR_5_ADDRESS]
  )
    return routeProcessor5Abi as Abi
  return
}

interface CallData {
  action: string // Human-readable comment
  target: Address | Token // contract to call
  callData?: Hex // calldata
  abi?: Abi | undefined
  functionName?: string
  args?: any[]
  validate?: (
    returnDataAsBigInt: bigint,
    returnDataRaw: Hex,
  ) => string | undefined // string in case of an error
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
  const client = createPublicClient({
    chain: publicClientConfig[chainId].chain,
    transport: http(
      `${ALCHEMY_ENTRY_POINTS[chainId]}${process.env['ALCHEMY_ID']}`,
    ),
  })

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
  const multicall3Data = encodeFunctionData({
    abi: multicall3Abi,
    functionName: 'aggregate3',
    args: [
      calls.map((call, i) => {
        if (call.callData !== undefined)
          return {
            target:
              call.target instanceof Token ? call.target.address : call.target,
            callData: call.callData,
            allowFailure: true,
          }
        else if (call.functionName)
          return {
            target:
              call.target instanceof Token ? call.target.address : call.target,
            callData: encodeFunctionData({
              abi: call.abi ?? erc20Abi,
              functionName: call.functionName,
              args: call.args ?? [],
            }),
            allowFailure: true,
          }
        else throw new Error(`Incorrect call data: ${i}`)
      }),
    ],
  })
  const { data: returnData } = await client.call({
    account: from,
    to: MULTICALL3_ADDRESS,
    data: multicall3Data,
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
  if (returnData === undefined) return `simulateRoute: Multicall error`

  const res = decodeFunctionResult({
    abi: multicall3Abi,
    functionName: 'aggregate3',
    data: returnData,
  })
  for (let i = 0; i < res.length; ++i) {
    const { success, returnData } = res[i] as {
      success: boolean
      returnData: `0x${string}`
    }
    const cd = calls[i] as CallData
    if (!success) {
      const err =
        cd.abi !== undefined
          ? decodeErrorResult({
              abi: cd.abi,
              data: returnData,
            })
          : returnData
      return `'${cd.action}' call error: ${err}`
    }
    if (cd.validate) cd.validate(BigInt(returnData), returnData)
  }

  return amountOut
}
