import { ChainId } from 'sushi'

import type { IconComponent } from '../../../types'
import { ApeCircle } from './ApeCircle'
import { AptosCircle } from './AptosCircle'
import { ArbitrumCircle } from './ArbitrumCircle'
import { ArbitrumNovaCircle } from './ArbitrumNovaCircle'
import { AvalancheCircle } from './AvalancheCircle'
import { BaseCircle } from './BaseCircle'
import { BeraCircle } from './BeraCircle'
import { BinanceCircle } from './BinanceCircle'
import { BlastCircle } from './BlastCircle'
import { BobaBNBCircle } from './BobaBNBCircle'
import { BobaCircle } from './BobaCircle'
import { BttcCircle } from './BttcCircle'
import { CeloCircle } from './CeloCircle'
import { CoreCircle } from './CoreCircle'
import { CronosCircle } from './CronosCircle'
import { EthereumCircle } from './EthereumCircle'
import { FantomCircle } from './FantomCircle'
import { FilecoinCircle } from './FilecoinCircle'
import { GnosisCircle } from './GnosisCircle'
import { HaqqCircle } from './HaqqCircle'
import { HarmonyCircle } from './HarmonyCircle'
import { HemiCircle } from './HemiCircle'
import { HyperEVMCircle } from './HyperEVMCircle'
import { KatanaCircle } from './KatanaCircle'
import { KavaCircle } from './KavaCircle'
import { LineaCircle } from './LineaCircle'
import { MantaCircle } from './MantaCircle'
import { MantleCircle } from './MantleCircle'
import { MetisCircle } from './MetisCircle'
import { ModeCircle } from './ModeCircle'
import { OptimismCircle } from './OptimismCircle'
import { PolygonCircle } from './PolygonCircle'
import { PolygonZKCircle } from './PolygonZKCircle'
import { RootstockCircle } from './RootstockCircle'
import { ScrollCircle } from './ScrollCircle'
import { SkaleCircle } from './SkaleCircle'
import { SonicCircle } from './SonicCircle'
import { TaikoCircle } from './TaikoCircle'
import { ThunderCoreCircle } from './ThunderCoreCircle'
import { TronCircle } from './TronCircle'
import { ZKLinkCircle } from './ZKLinkCircle'
import { ZKSyncCircle } from './ZKSyncCircle'
import { ZetaChainCircle } from './ZetaChainCircle'

export * from './ApeCircle'
export * from './AptosCircle'
export * from './ArbitrumCircle'
export * from './ArbitrumNovaCircle'
export * from './AvalancheCircle'
export * from './BaseCircle'
export * from './BeraCircle'
export * from './BlastCircle'
export * from './BinanceCircle'
export * from './BobaAvaxCircle'
export * from './BobaBNBCircle'
export * from './BobaCircle'
export * from './BttcCircle'
export * from './CeloCircle'
export * from './CoreCircle'
export * from './CronosCircle'
export * from './EthereumCircle'
export * from './FantomCircle'
export * from './FilecoinCircle'
export * from './FuseCircle'
export * from './GnosisCircle'
export * from './HaqqCircle'
export * from './HarmonyCircle'
export * from './HecoCircle'
export * from './HemiCircle'
export * from './HyperEVMCircle'
export * from './KatanaCircle'
export * from './KavaCircle'
export * from './LineaCircle'
export * from './MantaCircle'
export * from './MantleCircle'
export * from './MetisCircle'
export * from './ModeCircle'
export * from './MoonbeamCircle'
export * from './MoonriverCircle'
export * from './OkexCircle'
export * from './OptimismCircle'
export * from './PalmCircle'
export * from './PolygonCircle'
export * from './PolygonZKCircle'
export * from './RootstockCircle'
export * from './ScrollCircle'
export * from './SkaleCircle'
export * from './SonicCircle'
export * from './TaikoCircle'
export * from './TelosCircle'
export * from './ThunderCoreCircle'
export * from './TronCircle'
export * from './ZKLinkCircle'
export * from './ZKSyncCircle'
export * from './ZetaChainCircle'

export const NETWORK_CIRCLE_ICON: Partial<
  Record<ChainId | string, IconComponent>
> = {
  [ChainId.ETHEREUM]: EthereumCircle,
  [ChainId.FANTOM]: FantomCircle,
  [ChainId.POLYGON]: PolygonCircle,
  [ChainId.GNOSIS]: GnosisCircle,
  [ChainId.BSC]: BinanceCircle,
  [ChainId.ARBITRUM]: ArbitrumCircle,
  [ChainId.AVALANCHE]: AvalancheCircle,
  [ChainId.HARMONY]: HarmonyCircle,
  [ChainId.CELO]: CeloCircle,
  [ChainId.OPTIMISM]: OptimismCircle,
  [ChainId.METIS]: MetisCircle,
  [ChainId.KAVA]: KavaCircle,
  [ChainId.ARBITRUM_NOVA]: ArbitrumNovaCircle,
  [ChainId.BOBA]: BobaCircle,
  [ChainId.BOBA_BNB]: BobaBNBCircle,
  [ChainId.BTTC]: BttcCircle,
  [ChainId.POLYGON_ZKEVM]: PolygonZKCircle,
  [ChainId.THUNDERCORE]: ThunderCoreCircle,
  [ChainId.HAQQ]: HaqqCircle,
  [ChainId.CORE]: CoreCircle,
  [ChainId.ZKSYNC_ERA]: ZKSyncCircle,
  [ChainId.LINEA]: LineaCircle,
  [ChainId.BASE]: BaseCircle,
  [ChainId.SCROLL]: ScrollCircle,
  [ChainId.FILECOIN]: FilecoinCircle,
  [ChainId.ZETACHAIN]: ZetaChainCircle,
  [ChainId.BLAST]: BlastCircle,
  [ChainId.SKALE_EUROPA]: SkaleCircle,
  [ChainId.ROOTSTOCK]: RootstockCircle,
  [ChainId.CRONOS]: CronosCircle,
  [ChainId.MANTLE]: MantleCircle,
  [ChainId.MANTA]: MantaCircle,
  [ChainId.MODE]: ModeCircle,
  [ChainId.TAIKO]: TaikoCircle,
  [ChainId.ZKLINK]: ZKLinkCircle,
  [ChainId.APE]: ApeCircle,
  [ChainId.SONIC]: SonicCircle,
  [ChainId.HEMI]: HemiCircle,
  [ChainId.KATANA]: KatanaCircle,
  [ChainId.HYPEREVM]: HyperEVMCircle,
  [ChainId.BERACHAIN]: BeraCircle,
  [ChainId.APTOS]: AptosCircle,
  [ChainId.TRON]: TronCircle,
}
