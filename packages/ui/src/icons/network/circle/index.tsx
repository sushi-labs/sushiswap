import { ChainId } from '@sushiswap/chain'
import * as React from 'react'

import { ArbitrumCircle } from './ArbitrumCircle'
import { ArbitrumNovaCircle } from './ArbitrumNovaCircle'
import { AvalancheCircle } from './AvalancheCircle'
import { BinanceCircle } from './BinanceCircle'
import { BobaCircle } from './BobaCircle'
import { BobaBNBCircle } from './BobaBNBCircle'
import { BobaAvaxCircle } from './BobaAvaxCircle'
import { BttcCircle } from './BttcCircle'
import { CeloCircle } from './CeloCircle'
import { EthereumCircle } from './EthereumCircle'
import { FantomCircle } from './FantomCircle'
import { FuseCircle } from './FuseCircle'
import { GnosisCircle } from './GnosisCircle'
import { HarmonyCircle } from './HarmonyCircle'
import { HecoCircle } from './HecoCircle'
import { KavaCircle } from './KavaCircle'
import { MetisCircle } from './MetisCircle'
import { MoonbeamCircle } from './MoonbeamCircle'
import { MoonriverCircle } from './MoonriverCircle'
import { OkexCircle } from './OkexCircle'
import { OptimismCircle } from './OptimismCircle'
import { PalmCircle } from './PalmCircle'
import { PolygonCircle } from './PolygonCircle'
import { TelosCircle } from './TelosCircle'
import { ThunderCoreCircle } from './ThunderCoreCircle'
import { PolygonZKCircle } from '../../../future/components/icons'

export * from './ArbitrumCircle'
export * from './ArbitrumNovaCircle'
export * from './AvalancheCircle'
export * from './BinanceCircle'
export * from './BobaCircle'
export * from './BobaBNBCircle'
export * from './BobaAvaxCircle'
export * from './BttcCircle'
export * from './CeloCircle'
export * from './EthereumCircle'
export * from './FantomCircle'
export * from './FuseCircle'
export * from './GnosisCircle'
export * from './HarmonyCircle'
export * from './HecoCircle'
export * from './KavaCircle'
export * from './MetisCircle'
export * from './MoonbeamCircle'
export * from './MoonriverCircle'
export * from './OkexCircle'
export * from './OptimismCircle'
export * from './PalmCircle'
export * from './PolygonCircle'
export * from './TelosCircle'
export * from './ThunderCoreCircle'

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
  [ChainId.METIS]: MetisCircle,
  [ChainId.KAVA]: KavaCircle,
  [ChainId.ARBITRUM_NOVA]: ArbitrumNovaCircle,
  [ChainId.HECO]: HecoCircle,
  [ChainId.OKEX]: OkexCircle,
  [ChainId.PALM]: PalmCircle,
  [ChainId.BOBA]: BobaCircle,
  [ChainId.BOBA_AVAX]: BobaAvaxCircle,
  [ChainId.BOBA_BNB]: BobaBNBCircle,
  [ChainId.BTTC]: BttcCircle,
  [ChainId.POLYGON_ZKEVM]: PolygonZKCircle,
  [ChainId.THUNDERCORE]: ThunderCoreCircle,
}
