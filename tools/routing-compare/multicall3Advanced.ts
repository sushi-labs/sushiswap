import { ChainId } from 'sushi'
import { publicClientConfig } from 'sushi/config'
import { Token } from 'sushi/currency'
import {
  http,
  Abi,
  Address,
  Hex,
  StateOverride,
  createPublicClient,
  decodeErrorResult,
  decodeFunctionResult,
  encodeFunctionData,
  erc20Abi,
  multicall3Abi,
} from 'viem'

export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'

const ALCHEMY_ENTRY_POINTS: Record<number, string> = {
  [ChainId.ETHEREUM]: 'https://eth-mainnet.g.alchemy.com/v2/',
  [ChainId.POLYGON]: 'https://polygon-mainnet.g.alchemy.com/v2/',
  [ChainId.POLYGON_ZKEVM]: 'https://polygonzkevm-mainnet.g.alchemy.com/v2',
  [ChainId.ARBITRUM]: 'https://arb-mainnet.g.alchemy.com/v2/',
  [ChainId.OPTIMISM]: 'https://opt-mainnet.g.alchemy.com/v2/',
  [ChainId.BASE]: 'https://base-mainnet.g.alchemy.com/v2/',
}

export function ifNetworkSupported(chainId: ChainId) {
  return ALCHEMY_ENTRY_POINTS[chainId] !== undefined
}

export interface CallData {
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

export async function aggregate3({
  chainId,
  account,
  calls,
  stateOverride,
}: {
  chainId: ChainId
  account: Address
  calls: CallData[]
  stateOverride?: StateOverride | undefined
}): Promise<string | undefined> {
  const client = createPublicClient({
    chain: publicClientConfig[chainId].chain,
    transport: http(
      `${ALCHEMY_ENTRY_POINTS[chainId]}${process.env['ALCHEMY_ID']}`,
    ),
  })
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
    account,
    to: MULTICALL3_ADDRESS,
    data: multicall3Data,
    stateOverride,
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
      const abi = cd.target instanceof Token ? cd.abi ?? erc20Abi : cd.abi
      const err =
        abi !== undefined
          ? decodeErrorResult({
              abi,
              data: returnData,
            })
          : returnData
      return `'${cd.action}' call error: ${JSON.stringify(err)}`
    }
    if (cd.validate) {
      const err = cd.validate(BigInt(returnData), returnData)
      if (err) return err
    }
  }
  return undefined
}
