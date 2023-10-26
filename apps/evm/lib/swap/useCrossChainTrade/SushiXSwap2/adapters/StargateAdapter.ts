import {
  StargateAdapterChainId,
  isStargateAdapterChainId,
  STARGATE_CHAIN_ID,
  STARGATE_CHAIN_PATHS,
  STARGATE_ETH_ADDRESS,
  STARGATE_POOL_ID,
  STARGATE_USDC,
  STARGATE_USDC_ADDRESS,
  STARGATE_USDT,
  STARGATE_USDT_ADDRESS,
} from 'sushi/config'
import { Native, Type } from 'sushi/currency'
import { Percent } from 'sushi/math'
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem'

export const STARGATE_DEFAULT_SLIPPAGE = new Percent(100, 10_000) // 1%

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

export const getStargateBridgePath = (srcCurrency: Type, dstCurrency: Type) => {
  if (
    !isStargateAdapterChainId(srcCurrency.chainId) ||
    !isStargateAdapterChainId(dstCurrency.chainId)
  )
    return undefined
  const srcChainPaths =
    STARGATE_CHAIN_PATHS[srcCurrency.chainId as StargateAdapterChainId]

  // If srcCurrency is ETH, check for ETH path
  if (srcCurrency.isNative && srcCurrency.chainId in STARGATE_ETH_ADDRESS) {
    const ethPaths =
      srcChainPaths[
        STARGATE_ETH_ADDRESS[
          srcCurrency.chainId as keyof typeof STARGATE_ETH_ADDRESS
        ]
      ]

    if (
      ethPaths.find(
        (dstBridgeToken) => dstBridgeToken.chainId === dstCurrency.chainId,
      )
    ) {
      return {
        srcBridgeToken: srcCurrency,
        dstBridgeToken: Native.onChain(dstCurrency.chainId),
      }
    }
  }

  // Else fallback to USDC/USDT
  if (
    srcCurrency.chainId in STARGATE_USDC_ADDRESS ||
    srcCurrency.chainId in STARGATE_USDT_ADDRESS
  ) {
    const srcBridgeToken =
      srcCurrency.chainId in STARGATE_USDC
        ? STARGATE_USDC[srcCurrency.chainId as keyof typeof STARGATE_USDC]
        : STARGATE_USDT[srcCurrency.chainId as keyof typeof STARGATE_USDT]

    const usdPaths = srcChainPaths[srcBridgeToken.address as Address]

    const dstBridgeToken = usdPaths.find(
      (dstBridgeToken) => dstBridgeToken.chainId === dstCurrency.chainId,
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
