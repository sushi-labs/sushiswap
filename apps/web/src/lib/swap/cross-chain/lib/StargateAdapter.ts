import { NativeAddress } from 'src/lib/hooks/react-query'
import {
  STARGATE_CHAIN_ID,
  STARGATE_CHAIN_PATHS,
  STARGATE_ETH_ADDRESS,
  STARGATE_POOL_ID,
  STARGATE_USDC,
  STARGATE_USDC_ADDRESS,
  STARGATE_USDT,
  STARGATE_USDT_ADDRESS,
  StargateAdapterChainId,
} from 'sushi/config'
import { Native, Type } from 'sushi/currency'
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem'

export const STARGATE_SLIPPAGE_PERCENTAGE = 1 // 1%

/*
    struct StargateTeleportParams {
        uint16 dstChainId; // stargate dst chain id
        address token; // token getting bridged
        uint256 srcPoolId; // stargate src pool id
        uint256 dstPoolId; // stargate dst pool id
        uint256 amount; // amount to bridge
        uint256 amountMin; // amount to bridge minimum
        uint256 dustAmount; // native token to be received on dst chain
        address receiver; // detination address for sgReceive
        address to; // address for fallback tranfers on sgReceive
        uint256 gas; // extra gas to be sent for dst chain operations
    }
*/

export const encodeStargateTeleportParams = ({
  srcBridgeToken,
  dstBridgeToken,
  amount,
  amountMin,
  dustAmount,
  receiver,
  to,
  dstGas,
}: {
  srcBridgeToken: Type
  dstBridgeToken: Type
  amount: Parameters<typeof BigInt>[0]
  amountMin: Parameters<typeof BigInt>[0]
  dustAmount: Parameters<typeof BigInt>[0]
  receiver: Address
  to: Address
  dstGas: Parameters<typeof BigInt>[0]
}): string => {
  return encodeAbiParameters(
    parseAbiParameters(
      'uint16, address, uint256, uint256, uint256, uint256, uint256, address, address, uint256',
    ),
    [
      STARGATE_CHAIN_ID[dstBridgeToken.chainId as StargateAdapterChainId],
      srcBridgeToken.isNative
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : (srcBridgeToken.address as Address),
      BigInt(
        STARGATE_POOL_ID[srcBridgeToken.chainId as StargateAdapterChainId][
          srcBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[
                srcBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS
              ]
            : srcBridgeToken.address
        ],
      ),
      BigInt(
        STARGATE_POOL_ID[dstBridgeToken.chainId as StargateAdapterChainId][
          dstBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[
                dstBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS
              ]
            : dstBridgeToken.address
        ],
      ),
      BigInt(amount),
      BigInt(amountMin),
      BigInt(dustAmount),
      receiver,
      to,
      BigInt(dstGas),
    ],
  )
}

// estiamte gas in sgReceive()
export const estimateStargateDstGas = (gasUsed: number) => {
  // estGas = (150K + gasSpentTines * 1.25)
  return BigInt(Math.floor(gasUsed * 1.25) + 150000)
}

export const getStargateBridgePath = ({
  srcChainId,
  dstChainId,
  tokenIn,
}: {
  srcChainId: StargateAdapterChainId
  dstChainId: StargateAdapterChainId
  tokenIn: Address
  tokenOut: Address
}) => {
  const srcChainPaths = STARGATE_CHAIN_PATHS[srcChainId]

  // If srcCurrency is ETH, check for ETH path
  if (
    tokenIn.toLowerCase() === NativeAddress.toLowerCase() &&
    srcChainId in STARGATE_ETH_ADDRESS
  ) {
    const ethPaths =
      srcChainPaths[
        STARGATE_ETH_ADDRESS[srcChainId as keyof typeof STARGATE_ETH_ADDRESS]
      ]

    if (
      ethPaths.find((dstBridgeToken) => dstBridgeToken.chainId === dstChainId)
    ) {
      return {
        srcBridgeToken: Native.onChain(srcChainId),
        dstBridgeToken: Native.onChain(dstChainId),
      }
    }
  }

  // Else fallback to USDC/USDT
  if (
    srcChainId in STARGATE_USDC_ADDRESS ||
    srcChainId in STARGATE_USDT_ADDRESS
  ) {
    const srcBridgeToken =
      srcChainId in STARGATE_USDC
        ? STARGATE_USDC[srcChainId as keyof typeof STARGATE_USDC]
        : STARGATE_USDT[srcChainId as keyof typeof STARGATE_USDT]

    const usdPaths = srcChainPaths[srcBridgeToken.address as Address]

    const dstBridgeToken = usdPaths.find(
      (dstBridgeToken) => dstBridgeToken.chainId === dstChainId,
    )

    if (dstBridgeToken) {
      return {
        srcBridgeToken,
        dstBridgeToken,
      }
    }
  }

  return undefined
}
