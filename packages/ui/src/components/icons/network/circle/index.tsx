import { ChainId } from 'sushi/chain'

import { IconComponent } from '../../../../types'
import { ArbitrumCircle } from './ArbitrumCircle'
import { ArbitrumNovaCircle } from './ArbitrumNovaCircle'
import { AvalancheCircle } from './AvalancheCircle'
import { BaseCircle } from './BaseCircle'
import { BinanceCircle } from './BinanceCircle'
import { BobaAvaxCircle } from './BobaAvaxCircle'
import { BobaBNBCircle } from './BobaBNBCircle'
import { BobaCircle } from './BobaCircle'
import { BttcCircle } from './BttcCircle'
import { CeloCircle } from './CeloCircle'
import { CoreCircle } from './CoreCircle'
import { EthereumCircle } from './EthereumCircle'
import { FantomCircle } from './FantomCircle'
import { FilecoinCircle } from './FilecoinCircle'
import { FuseCircle } from './FuseCircle'
import { GnosisCircle } from './GnosisCircle'
import { HaqqCircle } from './HaqqCircle'
import { HarmonyCircle } from './HarmonyCircle'
import { HecoCircle } from './HecoCircle'
import { KavaCircle } from './KavaCircle'
import { LineaCircle } from './LineaCircle'
import { MetisCircle } from './MetisCircle'
import { MoonbeamCircle } from './MoonbeamCircle'
import { MoonriverCircle } from './MoonriverCircle'
import { OkexCircle } from './OkexCircle'
import { OptimismCircle } from './OptimismCircle'
import { PalmCircle } from './PalmCircle'
import { PolygonCircle } from './PolygonCircle'
import { PolygonZKCircle } from './PolygonZKCircle'
import { ScrollCircle } from './ScrollCircle'
import { TelosCircle } from './TelosCircle'
import { ThunderCoreCircle } from './ThunderCoreCircle'
import { ZetaChainCircle } from './ZetaChainCircle'

export * from './AptosCircle'
export * from './ArbitrumCircle'
export * from './ArbitrumNovaCircle'
export * from './AvalancheCircle'
export * from './BaseCircle'
export * from './BinanceCircle'
export * from './BobaAvaxCircle'
export * from './BobaBNBCircle'
export * from './BobaCircle'
export * from './BttcCircle'
export * from './CeloCircle'
export * from './CoreCircle'
export * from './EthereumCircle'
export * from './FantomCircle'
export * from './FilecoinCircle'
export * from './FuseCircle'
export * from './GnosisCircle'
export * from './HaqqCircle'
export * from './HarmonyCircle'
export * from './HecoCircle'
export * from './KavaCircle'
export * from './LineaCircle'
export * from './MetisCircle'
export * from './MoonbeamCircle'
export * from './MoonriverCircle'
export * from './OkexCircle'
export * from './OptimismCircle'
export * from './PalmCircle'
export * from './PolygonCircle'
export * from './PolygonZKCircle'
export * from './ScrollCircle'
export * from './TelosCircle'
export * from './ThunderCoreCircle'
export * from './ZetaChainCircle'

export const NETWORK_CIRCLE_ICON: Record<number, IconComponent> = {
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
  [ChainId.HAQQ]: HaqqCircle,
  [ChainId.CORE]: CoreCircle,
  [ChainId.ZKSYNC_ERA]: EthereumCircle,
  [ChainId.LINEA]: LineaCircle,
  [ChainId.BASE]: BaseCircle,
  [ChainId.SCROLL]: ScrollCircle,
  [ChainId.FILECOIN]: FilecoinCircle,
  [ChainId.ZETACHAIN]: ZetaChainCircle,
}
