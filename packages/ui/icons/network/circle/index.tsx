import { ChainId } from '@sushiswap/chain'
import * as React from 'react'

import { ArbitrumCircle } from './ArbitrumCircle'
import { AvalancheCircle } from './AvalancheCircle'
import { BinanceCircle } from './BinanceCircle'
import { CeloCircle } from './CeloCircle'
import { EthereumCircle } from './EthereumCircle'
import { FantomCircle } from './FantomCircle'
import { FuseCircle } from './FuseCircle'
import { GnosisCircle } from './GnosisCircle'
import { HarmonyCircle } from './HarmonyCircle'
import { MoonbeamCircle } from './MoonbeamCircle'
import { MoonriverCircle } from './MoonriverCircle'
import { OptimismCircle } from './OptimismCircle'
import { PolygonCircle } from './PolygonCircle'
import { TelosCircle } from './TelosCircle'

export * from './ArbitrumCircle'
export * from './AvalancheCircle'
export * from './BinanceCircle'
export * from './CeloCircle'
export * from './EthereumCircle'
export * from './FantomCircle'
export * from './FuseCircle'
export * from './GnosisCircle'
export * from './HarmonyCircle'
export * from './MoonbeamCircle'
export * from './MoonriverCircle'
export * from './OptimismCircle'
export * from './PolygonCircle'
export * from './TelosCircle'

export const NETWORK_CIRCLE_ICON: Record<number, (props: React.ComponentProps<'svg'>) => JSX.Element> = {
  [ChainId.ETHEREUM]: EthereumCircle,
  [ChainId.FANTOM]: FantomCircle,
  [ChainId.POLYGON]: PolygonCircle,
  [ChainId.GNOSIS]: GnosisCircle,
  [ChainId.BSC]: BinanceCircle,
  [ChainId.ARBITRUM]: ArbitrumCircle,
  [ChainId.AVALANCHE]: AvalancheCircle,
  [ChainId.HARMONY]: HarmonyCircle,
  [ChainId.CELO]: CeloCircle,
  [ChainId.MOONRIVER]: MoonriverCircle,
  [ChainId.FUSE]: FuseCircle,
  [ChainId.TELOS]: TelosCircle,
  [ChainId.MOONBEAM]: MoonbeamCircle,
  [ChainId.OPTIMISM]: OptimismCircle,
}
