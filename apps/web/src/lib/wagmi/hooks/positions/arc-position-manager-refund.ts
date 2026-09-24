import {
  type EvmAddress,
  EvmChainId,
  nonfungiblePositionManagerAbi_multicall,
  nonfungiblePositionManagerAbi_refundETH,
} from 'sushi/evm'
import { type Hex, encodeFunctionData, isAddressEqual } from 'viem'

const ARC_V1_POSITION_MANAGER = '0xf27f32580a399bDb55b6E1F025B8985c97e2A9D5'

/** Atomically clears donated native USDC */
export function withArcPositionManagerRefund({
  chainId,
  positionManager,
  calldata,
  value,
}: {
  chainId: EvmChainId
  positionManager: EvmAddress
  calldata: Hex
  value: bigint
}): { calldata: Hex; value: bigint } {
  if (
    chainId !== EvmChainId.ARC ||
    !isAddressEqual(positionManager, ARC_V1_POSITION_MANAGER)
  ) {
    return { calldata, value }
  }
  if (value !== 0n) {
    throw new Error(
      'Arc liquidity additions require zero native transaction value',
    )
  }

  // Always include cleanup: a donation can arrive after simulation. Nested NPM
  // multicalls preserve the owner as msg.sender through delegatecall. Wallets
  // must accept the native refund; simulate this complete transaction before sending.
  return {
    calldata: encodeFunctionData({
      abi: nonfungiblePositionManagerAbi_multicall,
      functionName: 'multicall',
      args: [
        [
          encodeFunctionData({
            abi: nonfungiblePositionManagerAbi_refundETH,
            functionName: 'refundETH',
          }),
          calldata,
        ],
      ],
    }),
    value: 0n,
  }
}
