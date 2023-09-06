import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { BigintIsh } from '@sushiswap/math'
import { NativeAddress } from '@sushiswap/react-query'
import { STARGATE_CHAIN_ID, STARGATE_ETH_ADDRESS, STARGATE_POOL_ID } from '@sushiswap/stargate'
import { SushiXSwapV2ChainId } from '@sushiswap/wagmi'
import { Address, encodeAbiParameters, parseAbiParameters } from 'viem'

export const stargateAdapterAddress = {
  [ChainId.ARBITRUM]: '0x3541e8529d17396048a5068efc361b9fdad21eea',
  [ChainId.OPTIMISM]: '0x4f52281a6a10db9761ceb39435f96d286f684d86',
  [ChainId.POLYGON]: '0x6df3838fcefd6642ad1435a4d93ed8bf6fd772f5',
  [ChainId.BSC]: '0xa7d7fbe0b2122f7055bebfe8e5f793034339ad1f',
  [ChainId.ETHEREUM]: '0x8a9f096992d4adf48c4e302b3593832785ddde01',
  [ChainId.AVALANCHE]: '0xac8d8775dfb6de938d50aeb76972f77a1682dc85',
} as const

export const encodeStargateTeleportParams = ({
  srcBridgeToken,
  dstBridgeToken,
  amount,
  amountMin,
  dustAmount,
  receiver,
  to,
  gas,
}: {
  srcBridgeToken: Type
  dstBridgeToken: Type
  amount: BigintIsh
  amountMin: BigintIsh
  dustAmount: BigintIsh
  receiver: Address
  to: Address
  gas: BigintIsh
}): string => {
  return encodeAbiParameters(
    parseAbiParameters('uint16, address, uint256, uint256, uint256, uint256, uint256, address, address, uint256'),
    [
      STARGATE_CHAIN_ID[dstBridgeToken.chainId as SushiXSwapV2ChainId],
      srcBridgeToken.isNative ? NativeAddress : (srcBridgeToken.address as Address),
      BigInt(
        STARGATE_POOL_ID[srcBridgeToken.chainId as SushiXSwapV2ChainId][
          srcBridgeToken.isNative
            ? STARGATE_ETH_ADDRESS[srcBridgeToken.chainId as keyof typeof STARGATE_ETH_ADDRESS]
            : srcBridgeToken.address
        ]
      ),
      BigInt(
        STARGATE_POOL_ID[dstBridgeToken.chainId as SushiXSwapV2ChainId][
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
      BigInt(gas),
    ]
  )
}

// estiamte gas in sgReceive()
export const estimateStargateDstGas = (gasUsed: number) => {
  // estGas = (150K + gasSpentTines * 1.5)
  return BigInt(Math.floor(gasUsed * 1.5) + 150000)
}
