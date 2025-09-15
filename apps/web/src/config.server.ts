import {
  BLADE_SUPPORTED_CHAIN_IDS,
  type BladeChainId,
  isBladeChainId,
} from 'sushi/evm'
import { BLADE_PUBLIC_CHAIN_IDS } from './config'
import { showBladeFlag, showHiddenBladeChainsFlag } from './flags'

export async function getPublicBladeChainIds(): Promise<
  readonly BladeChainId[]
> {
  const [showBlade, showHiddenBladeChains] = await Promise.all([
    showBladeFlag(),
    showHiddenBladeChainsFlag(),
  ])

  if (!showBlade) {
    return []
  }

  return showHiddenBladeChains
    ? BLADE_SUPPORTED_CHAIN_IDS
    : BLADE_PUBLIC_CHAIN_IDS
}

export async function isPublicBladeChainId(chainId: number): Promise<boolean> {
  const publicBladeChainIds = await getPublicBladeChainIds()
  return isBladeChainId(chainId) && publicBladeChainIds.includes(chainId)
}
