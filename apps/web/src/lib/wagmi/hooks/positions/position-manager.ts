import {
  type EvmAddress,
  EvmChainId,
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
} from 'sushi/evm'
import { ARC_V1_POSITION_MANAGER } from './arc-position-manager-refund'

export function getPositionManagers(chainId: SushiSwapV3ChainId): EvmAddress[] {
  const managers = [SUSHISWAP_V3_POSITION_MANAGER[chainId]]
  if (
    chainId === EvmChainId.ARC &&
    !managers.some(
      (manager) =>
        manager.toLowerCase() === ARC_V1_POSITION_MANAGER.toLowerCase(),
    )
  ) {
    managers.push(ARC_V1_POSITION_MANAGER)
  }
  return managers
}

export function getPositionManager(
  chainId: SushiSwapV3ChainId,
  positionManager?: string | null,
): EvmAddress {
  if (positionManager == null) return SUSHISWAP_V3_POSITION_MANAGER[chainId]

  const manager = getPositionManagers(chainId).find(
    (manager) => manager.toLowerCase() === positionManager.toLowerCase(),
  )
  if (!manager) throw new Error('Unsupported position manager')
  return manager
}
