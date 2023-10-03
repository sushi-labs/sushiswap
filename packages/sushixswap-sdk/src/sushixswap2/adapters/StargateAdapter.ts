import { ChainId } from '@sushiswap/chain'
import { Native, Type } from '@sushiswap/currency'
import {
  STARGATE_CHAIN_ID,
  STARGATE_CHAIN_PATHS,
  STARGATE_ETH_ADDRESS,
  STARGATE_POOL_ID,
  STARGATE_USDC,
  STARGATE_USDC_ADDRESS,
  STARGATE_USDT,
  STARGATE_USDT_ADDRESS,
  StargateChainId,
} from '@sushiswap/stargate'
import { Percent } from '@sushiswap/math'
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem'
import { SushiXSwap2ChainId } from '../..'

export const STARGATE_DEFAULT_SLIPPAGE = new Percent(100, 10_000) // 1%

export const STARGATE_ADAPTER_SUPPORTED_CHAIN_IDS = [
  ChainId.ETHEREUM,
  ChainId.BSC,
  ChainId.AVALANCHE,
  ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  ChainId.BASE,
] as const

export type StargateAdapterChainId = (typeof STARGATE_ADAPTER_SUPPORTED_CHAIN_IDS)[number]

export const STARGATE_ADAPTER_ADDRESS: Record<StargateAdapterChainId, `0x${string}`> = {
  [ChainId.ETHEREUM]: '0x09938716c4a086a4ebfe10377fdad96f32541303',
  [ChainId.BSC]: '0x09938716c4a086a4ebfe10377fdad96f32541303',
  [ChainId.AVALANCHE]: '0x09938716c4a086a4ebfe10377fdad96f32541303',
  [ChainId.POLYGON]: '0x02a480a258361c9Bc3eaacBd6473364C67adCD3a',
  [ChainId.ARBITRUM]: '0x09938716c4a086a4ebfe10377fdad96f32541303',
  [ChainId.OPTIMISM]: '0x09938716c4a086a4ebfe10377fdad96f32541303',
  [ChainId.BASE]: '0x09938716c4a086a4ebfe10377fdad96f32541303',
} as const

export const isStargateAdapterChainId = (chainId: ChainId): chainId is StargateAdapterChainId =>
  STARGATE_ADAPTER_SUPPORTED_CHAIN_IDS.includes(chainId as StargateAdapterChainId)

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
    parseAbiParameters('uint16, address, uint256, uint256, uint256, uint256, uint256, address, address, uint256'),
    [
      STARGATE_CHAIN_ID[dstBridgeToken.chainId as SushiXSwap2ChainId],
      srcBridgeToken.isNative ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : (srcBridgeToken.address as Address),
      BigInt(
        STARGATE_POOL_ID[srcBridgeToken.chainId as SushiXSwap2ChainId][
          srcBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[srcBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS]
            : srcBridgeToken.address
        ]
      ),
      BigInt(
        STARGATE_POOL_ID[dstBridgeToken.chainId as SushiXSwap2ChainId][
          dstBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[dstBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS]
            : dstBridgeToken.address
        ]
      ),
      BigInt(amount),
      BigInt(amountMin),
      BigInt(dustAmount),
      receiver,
      to,
      BigInt(dstGas),
    ]
  )
}

// estiamte gas in sgReceive()
export const estimateStargateDstGas = (gasUsed: number) => {
  // estGas = (100K + gasSpentTines * 1.25)
  return BigInt(Math.floor(gasUsed * 1.25) + 100000)
}

export const getStargateBridgePath = (srcCurrency: Type, dstCurrency: Type) => {
  if (!isStargateAdapterChainId(srcCurrency.chainId) || !isStargateAdapterChainId(dstCurrency.chainId)) return undefined
  const srcChainPaths = STARGATE_CHAIN_PATHS[srcCurrency.chainId as StargateChainId]

  // If srcCurrency is ETH, check for ETH path
  if (srcCurrency.isNative && srcCurrency.chainId in STARGATE_ETH_ADDRESS) {
    const ethPaths = srcChainPaths[STARGATE_ETH_ADDRESS[srcCurrency.chainId as keyof typeof STARGATE_ETH_ADDRESS]]

    if (ethPaths.find((dstBridgeToken) => dstBridgeToken.chainId === dstCurrency.chainId)) {
      return {
        srcBridgeToken: srcCurrency,
        dstBridgeToken: Native.onChain(dstCurrency.chainId),
      }
    }
  }

  // Else fallback to USDC/USDT
  if (srcCurrency.chainId in STARGATE_USDC_ADDRESS || srcCurrency.chainId in STARGATE_USDT_ADDRESS) {
    const srcBridgeToken =
      srcCurrency.chainId in STARGATE_USDC
        ? STARGATE_USDC[srcCurrency.chainId as keyof typeof STARGATE_USDC]
        : STARGATE_USDT[srcCurrency.chainId as keyof typeof STARGATE_USDT]

    const usdPaths = srcChainPaths[srcBridgeToken.address as Address]

    const dstBridgeToken = usdPaths.find((dstBridgeToken) => dstBridgeToken.chainId === dstCurrency.chainId)

    if (dstBridgeToken) {
      return {
        srcBridgeToken,
        dstBridgeToken,
      }
    }
  }

  return undefined
}
