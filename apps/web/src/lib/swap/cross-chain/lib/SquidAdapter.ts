import { Token as SquidToken } from '@0xsquid/squid-types'
import { tradeValidator02 } from '@sushiswap/react-query'
import { squidRouterAbi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { SquidAdapterChainId } from 'sushi/config'
import { Token } from 'sushi/currency'
import { PoolType, RouteStatus } from 'sushi/router'
import {
  Hex,
  decodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
  zeroAddress,
} from 'viem'
import { z } from 'zod'

export const isSquidRouteProcessorEnabled: Record<
  SquidAdapterChainId,
  boolean
> = {
  [ChainId.ETHEREUM]: true,
  [ChainId.BSC]: true,
  [ChainId.AVALANCHE]: true,
  [ChainId.POLYGON]: true,
  [ChainId.ARBITRUM]: true,
  [ChainId.OPTIMISM]: true,
  [ChainId.BASE]: true,
  [ChainId.FANTOM]: true,
  [ChainId.LINEA]: true,
  [ChainId.KAVA]: true,
  [ChainId.MOONBEAM]: false,
  [ChainId.CELO]: true,
  [ChainId.SCROLL]: true,
  [ChainId.FILECOIN]: true,
  [ChainId.BLAST]: true,
}

/*
  SquidBridgeParams {
    address token; // token being bridged
    bytes squidRouterData; // abi-encoded squidRouter calldata
  }
*/
export const encodeSquidBridgeParams = ({
  srcBridgeToken,
  callData,
}: {
  srcBridgeToken: Token
  callData: Hex
}) => {
  return encodeAbiParameters(parseAbiParameters('address, bytes'), [
    srcBridgeToken.address,
    callData,
  ])
}

export const decodeSquidRouterCallData = (data: `0x${string}`) => {
  return decodeFunctionData({ abi: squidRouterAbi, data })
}

// this is only used for route preview
export const getSquidTrade = (
  fromToken: SquidToken | Token,
  toToken: SquidToken | Token,
): z.infer<typeof tradeValidator02> => {
  return {
    status: RouteStatus.Success,
    tokens: [
      {
        name: fromToken.name ?? '',
        symbol: fromToken.symbol ?? '',
        decimals: fromToken.decimals,
        address: fromToken.address,
      },
      {
        name: toToken.name ?? '',
        symbol: toToken.symbol ?? '',
        decimals: toToken.decimals,
        address: toToken.address,
      },
    ],
    tokenFrom: 0,
    tokenTo: 1,
    primaryPrice: 0,
    swapPrice: 0,
    priceImpact: 0,
    amountIn: '',
    assumedAmountOut: '',
    gasSpent: 0,
    route: [
      {
        poolAddress: zeroAddress,
        poolType: PoolType.Unknown,
        poolName: 'Squid',
        poolFee: 0,
        tokenFrom: 0,
        tokenTo: 1,
        share: 1,
        assumedAmountIn: '',
        assumedAmountOut: '',
      },
    ],
  }
}
