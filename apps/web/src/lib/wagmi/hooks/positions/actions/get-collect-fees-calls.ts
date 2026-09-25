import { Fraction } from 'sushi'
import {
  type CollectOptions,
  type EvmAddress,
  NonfungiblePositionManager,
  type SushiSwapV3ChainId,
} from 'sushi/evm'
import type { Hex } from 'viem'
import { getPositionManager } from '../position-manager'

export function getCollectFeesCalls({
  chainId,
  positions,
}: {
  chainId: SushiSwapV3ChainId
  positions: (CollectOptions & { positionManager: EvmAddress })[]
}): {
  to: EvmAddress
  data: Hex
  value: bigint
  chainId: SushiSwapV3ChainId
}[] {
  const groups = new Map<EvmAddress, CollectOptions[]>()
  for (const { positionManager, ...position } of positions) {
    const manager = getPositionManager(chainId, positionManager)
    const group = groups.get(manager) ?? []
    group.push(position)
    groups.set(manager, group)
  }

  return Array.from(groups, ([to, positions]) => {
    const { calldata, value } =
      NonfungiblePositionManager.collectCallParameters(positions, {
        minimumAmountTolerance: new Fraction(1),
      })
    return { to, data: calldata as Hex, value: BigInt(value), chainId }
  })
}
