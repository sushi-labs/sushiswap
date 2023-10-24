import { ChainId } from 'sushi/chain'

import { IconComponent } from '../../../../types'
import { ArbitrumNaked } from './ArbitrumNaked'
import { ArbitrumNovaNaked } from './ArbitrumNovaNaked'
import { AvalancheNaked } from './AvalancheNaked'
import { BaseNaked } from './BaseNaked'
import { BinanceNaked } from './BinanceNaked'
import { BobaAvaxNaked } from './BobaAvaxNaked'
import { BobaBNBNaked } from './BobaBNBNaked'
import { BobaNaked } from './BobaNaked'
import { BttcNaked } from './BttcNaked'
import { CeloNaked } from './CeloNaked'
import { CoreNaked } from './CoreNaked'
import { EthereumNaked } from './EthereumNaked'
import { FantomNaked } from './FantomNaked'
import { FilecoinNaked } from './FilecoinNaked'
import { FuseNaked } from './FuseNaked'
import { GnosisNaked } from './GnosisNaked'
import { HaqqNakked } from './HaqqNaked'
import { HarmonyNaked } from './HarmonyNaked'
import { HecoNaked } from './HecoNaked'
import { KavaNaked } from './KavaNaked'
import { LineaNaked } from './LineaNaked'
import { MetisNaked } from './MetisNaked'
import { MoonbeamNaked } from './MoonbeamNaked'
import { MoonriverNaked } from './MoonriverNaked'
import { OkexNaked } from './OkexNaked'
import { OptimismNaked } from './OptimismNaked'
import { PalmNaked } from './PalmNaked'
import { PolygonNaked } from './PolygonNaked'
import { PolygonZKNaked } from './PolygonZKNaked'
import { TelosNaked } from './TelosNaked'
import { ThunderCoreNaked } from './ThunderCoreNaked'

export * from './ArbitrumNaked'
export * from './ArbitrumNovaNaked'
export * from './AvalancheNaked'
export * from './BaseNaked'
export * from './BinanceNaked'
export * from './BobaAvaxNaked'
export * from './BobaBNBNaked'
export * from './BobaNaked'
export * from './BttcNaked'
export * from './CeloNaked'
export * from './CoreNaked'
export * from './EthereumNaked'
export * from './FantomNaked'
export * from './FilecoinNaked'
export * from './FuseNaked'
export * from './GnosisNaked'
export * from './HaqqNaked'
export * from './HarmonyNaked'
export * from './HecoNaked'
export * from './KavaNaked'
export * from './LineaNaked'
export * from './MetisNaked'
export * from './MoonbeamNaked'
export * from './MoonriverNaked'
export * from './OkexNaked'
export * from './OptimismNaked'
export * from './PalmNaked'
export * from './PolygonNaked'
export * from './PolygonZKNaked'
export * from './TelosNaked'

export const NETWORK_NAKED_ICON: Record<number, IconComponent> = {
  [ChainId.ETHEREUM]: EthereumNaked,
  [ChainId.FANTOM]: FantomNaked,
  [ChainId.POLYGON]: PolygonNaked,
  [ChainId.GNOSIS]: GnosisNaked,
  [ChainId.BSC]: BinanceNaked,
  [ChainId.ARBITRUM]: ArbitrumNaked,
  [ChainId.AVALANCHE]: AvalancheNaked,
  [ChainId.HARMONY]: HarmonyNaked,
  [ChainId.CELO]: CeloNaked,
  [ChainId.MOONRIVER]: MoonriverNaked,
  [ChainId.FUSE]: FuseNaked,
  [ChainId.TELOS]: TelosNaked,
  [ChainId.MOONBEAM]: MoonbeamNaked,
  [ChainId.OPTIMISM]: OptimismNaked,
  [ChainId.KAVA]: KavaNaked,
  [ChainId.METIS]: MetisNaked,
  [ChainId.ARBITRUM_NOVA]: ArbitrumNovaNaked,
  [ChainId.HECO]: HecoNaked,
  [ChainId.OKEX]: OkexNaked,
  [ChainId.PALM]: PalmNaked,
  [ChainId.BOBA]: BobaNaked,
  [ChainId.BOBA_AVAX]: BobaAvaxNaked,
  [ChainId.BOBA_BNB]: BobaBNBNaked,
  [ChainId.BTTC]: BttcNaked,
  [ChainId.POLYGON_ZKEVM]: PolygonZKNaked,
  [ChainId.THUNDERCORE]: ThunderCoreNaked,
  [ChainId.HAQQ]: HaqqNakked,
  [ChainId.CORE]: CoreNaked,
  [ChainId.ZKSYNC_ERA]: EthereumNaked,
  [ChainId.LINEA]: LineaNaked,
  [ChainId.BASE]: BaseNaked,
  [ChainId.FILECOIN]: FilecoinNaked
}
