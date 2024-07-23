import { squidRouterAbi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { SquidAdapterChainId } from 'sushi/config'
import { Token } from 'sushi/currency'
import {
  Hex,
  decodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
} from 'viem'

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
