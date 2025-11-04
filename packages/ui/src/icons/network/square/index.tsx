import { ChainId } from 'sushi'

import type { IconComponent } from '../../../types'
import { ApeSquare } from './ApeSquare'
import { AptosSquare } from './AptosSquare'
import { ArbitrumNovaSquare } from './ArbitrumNovaSquare'
import { ArbitrumSquare } from './ArbitrumSquare'
import { AvalancheSquare } from './AvalancheSquare'
import { BaseSquare } from './BaseSquare'
import { BeraSquare } from './BeraSquare'
import { BinanceSquare } from './BinanceSquare'
import { BlastSquare } from './BlastSquare'
// import { BobaAvaxSquare } from "./BobaAvaxSquare";
import { BobaBNBSquare } from './BobaBNBSquare'
import { BobaSquare } from './BobaSquare'
import { BttcSquare } from './BttcSquare'
import { CeloSquare } from './CeloSquare'
import { CoreSquare } from './CoreSquare'
import { CronosSquare } from './CronosSquare'
import { EthereumSquare } from './EthereumSquare'
import { FantomSquare } from './FantomSquare'
import { FilecoinSquare } from './FilecoinSquare'
import { GnosisSquare } from './GnosisSquare'
import { HaqqSquare } from './HaqqSquare'
import { HarmonySquare } from './HarmonySquare'
// import { HecoSquare } from "./HecoSquare";
import { HemiSquare } from './HemiSquare'
import { HyperEVMSquare } from './HyperEVMSquare'
import { KatanaSquare } from './KatanaSquare'
import { KavaSquare } from './KavaSquare'
import { LineaSquare } from './LineaSquare'
import { MantaSquare } from './MantaSquare'
import { MantleSquare } from './MantleSquare'
import { MetisSquare } from './MetisSquare'
import { ModeSquare } from './ModeSquare'
// import { OkexSquare } from "./OkexSquare";
import { OptimismSquare } from './OptimismSquare'
import { PlasmaSquare } from './PlasmaSquare'
// import { PalmSquare } from "./PalmSquare";
import { PolygonSquare } from './PolygonSquare'
import { PolygonZKSquare } from './PolygonZKSquare'
import { RootstockSquare } from './RootstockSquare'
import { ScrollSquare } from './ScrollSquare'
import { SkaleSquare } from './SkaleSquare'
import { SonicSquare } from './SonicSquare'
import { TaikoSquare } from './TaikoSquare'
import { ThunderCoreSquare } from './ThunderCoreSquare'
import { TronSquare } from './TronSquare'
import { ZKLinkSquare } from './ZKLinkSquare'
import { ZKSyncSquare } from './ZKSyncSquare'
import { ZetaChainSquare } from './ZetaChainSquare'

export * from './ApeSquare'
export * from './AptosSquare'
export * from './ArbitrumSquare'
export * from './ArbitrumNovaSquare'
export * from './AvalancheSquare'
export * from './BaseSquare'
export * from './BeraSquare'
export * from './BlastSquare'
export * from './BinanceSquare'
export * from './BobaAvaxSquare'
export * from './BobaBNBSquare'
export * from './BobaSquare'
export * from './BttcSquare'
export * from './CeloSquare'
export * from './CoreSquare'
export * from './CronosSquare'
export * from './EthereumSquare'
export * from './FantomSquare'
export * from './FilecoinSquare'
export * from './FuseSquare'
export * from './GnosisSquare'
export * from './HaqqSquare'
export * from './HarmonySquare'
export * from './HecoSquare'
export * from './HemiSquare'
export * from './HyperEVMSquare'
export * from './KavaSquare'
export * from './LineaSquare'
export * from './MantaSquare'
export * from './MantleSquare'
export * from './MetisSquare'
export * from './ModeSquare'
export * from './MoonbeamSquare'
export * from './MoonriverSquare'
export * from './OkexSquare'
export * from './OptimismSquare'
export * from './PalmSquare'
export * from './PlasmaSquare'
export * from './PolygonSquare'
export * from './PolygonZKSquare'
export * from './RootstockSquare'
export * from './ScrollSquare'
export * from './SkaleSquare'
export * from './SonicSquare'
export * from './TaikoSquare'
export * from './TelosSquare'
export * from './ThunderCoreSquare'
export * from './TronSquare'
export * from './ZKLinkSquare'
export * from './ZKSyncSquare'
export * from './ZetaChainSquare'
export * from './KatanaSquare'
export * from './PlasmaSquare'

// [ChainId.HECO]: HecoSquare,// currently not exported from sushi/chain
// [ChainId.OKEX]: OkexSquare,// currently not exported from sushi/chain
// [ChainId.PALM]: PalmSquare,// currently not exported from sushi/chain
// [ChainId.BOBA_AVAX]: BobaAvaxSquare,// currently not exported from sushi/chain

export const NETWORK_SQUARE_ICON: Partial<
  Record<ChainId | string, IconComponent>
> = {
  [ChainId.ETHEREUM]: EthereumSquare,
  [ChainId.FANTOM]: FantomSquare,
  [ChainId.POLYGON]: PolygonSquare,
  [ChainId.GNOSIS]: GnosisSquare,
  [ChainId.BSC]: BinanceSquare,
  [ChainId.ARBITRUM]: ArbitrumSquare,
  [ChainId.AVALANCHE]: AvalancheSquare,
  [ChainId.HARMONY]: HarmonySquare,
  [ChainId.CELO]: CeloSquare,
  [ChainId.OPTIMISM]: OptimismSquare,
  [ChainId.METIS]: MetisSquare,
  [ChainId.KAVA]: KavaSquare,
  [ChainId.ARBITRUM_NOVA]: ArbitrumNovaSquare,
  [ChainId.HYPEREVM]: HyperEVMSquare,
  [ChainId.BERACHAIN]: BeraSquare,
  [ChainId.BOBA]: BobaSquare,
  [ChainId.BOBA_BNB]: BobaBNBSquare,
  [ChainId.BTTC]: BttcSquare,
  [ChainId.POLYGON_ZKEVM]: PolygonZKSquare,
  [ChainId.THUNDERCORE]: ThunderCoreSquare,
  [ChainId.HAQQ]: HaqqSquare,
  [ChainId.CORE]: CoreSquare,
  [ChainId.ZKSYNC_ERA]: ZKSyncSquare,
  [ChainId.LINEA]: LineaSquare,
  [ChainId.BASE]: BaseSquare,
  [ChainId.SCROLL]: ScrollSquare,
  [ChainId.FILECOIN]: FilecoinSquare,
  [ChainId.ZETACHAIN]: ZetaChainSquare,
  [ChainId.BLAST]: BlastSquare,
  [ChainId.SKALE_EUROPA]: SkaleSquare,
  [ChainId.ROOTSTOCK]: RootstockSquare,
  [ChainId.CRONOS]: CronosSquare,
  [ChainId.MANTLE]: MantleSquare,
  [ChainId.MANTA]: MantaSquare,
  [ChainId.MODE]: ModeSquare,
  [ChainId.TAIKO]: TaikoSquare,
  [ChainId.ZKLINK]: ZKLinkSquare,
  [ChainId.APE]: ApeSquare,
  [ChainId.SONIC]: SonicSquare,
  [ChainId.HEMI]: HemiSquare,
  [ChainId.PLASMA]: PlasmaSquare,
  [ChainId.KATANA]: KatanaSquare,
  [ChainId.APTOS]: AptosSquare,
  [ChainId.TRON]: TronSquare,
}
