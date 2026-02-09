import { ChainId } from 'sushi'

import type { IconComponent } from '../../../types'
import { ApeNaked } from './ApeNaked'
import { AptosNaked } from './AptosNaked'
import { ArbitrumNaked } from './ArbitrumNaked'
import { ArbitrumNovaNaked } from './ArbitrumNovaNaked'
import { AvalancheNaked } from './AvalancheNaked'
import { BaseNaked } from './BaseNaked'
import { BeraNaked } from './BeraNaked'
import { BinanceNaked } from './BinanceNaked'
import { BlastNaked } from './BlastNaked'
import { BobaBNBNaked } from './BobaBNBNaked'
import { BobaNaked } from './BobaNaked'
import { BttcNaked } from './BttcNaked'
import { CeloNaked } from './CeloNaked'
import { CoreNaked } from './CoreNaked'
import { CronosNaked } from './CronosNaked'
import { EthereumNaked } from './EthereumNaked'
import { FantomNaked } from './FantomNaked'
import { FilecoinNaked } from './FilecoinNaked'
import { GnosisNaked } from './GnosisNaked'
import { HaqqNaked } from './HaqqNaked'
import { HarmonyNaked } from './HarmonyNaked'
import { HecoNaked } from './HecoNaked'
import { HemiNaked } from './HemiNaked'
import { HyperEVMNaked } from './HyperEVMNaked'
import { KatanaNaked } from './KatanaNaked'
import { KavaNaked } from './KavaNaked'
import { LineaNaked } from './LineaNaked'
import { MantaNaked } from './MantaNaked'
import { MantleNaked } from './MantleNaked'
import { MegaETHNaked } from './MegaETHNaked'
import { MetisNaked } from './MetisNaked'
import { ModeNaked } from './ModeNaked'
import { MonadNaked } from './MonadNaked'
import { OptimismNaked } from './OptimismNaked'
import { PlasmaNaked } from './PlasmaNaked'
import { PolygonNaked } from './PolygonNaked'
import { PolygonZKNaked } from './PolygonZKNaked'
import { RootstockNaked } from './RootstockNaked'
import { ScrollNaked } from './ScrollNaked'
import { SkaleNaked } from './SkaleNaked'
import { SolanaNaked } from './SolanaNaked'
import { SonicNaked } from './SonicNaked'
import { TaikoNaked } from './TaikoNaked'
import { ThunderCoreNaked } from './ThunderCoreNaked'
import { XLayerNaked } from './XLayerNaked'
import { ZKLinkNaked } from './ZKLinkNaked'
import { ZKSyncNaked } from './ZKSyncNaked'
import { ZetaChainNaked } from './ZetaChainNaked'

export * from './ApeNaked'
export * from './AptosNaked'
export * from './ArbitrumNaked'
export * from './ArbitrumNovaNaked'
export * from './AvalancheNaked'
export * from './BaseNaked'
export * from './BeraNaked'
export * from './BinanceNaked'
export * from './BlastNaked'
export * from './BobaAvaxNaked'
export * from './BobaBNBNaked'
export * from './BobaNaked'
export * from './BttcNaked'
export * from './CeloNaked'
export * from './CoreNaked'
export * from './CronosNaked'
export * from './EthereumNaked'
export * from './FantomNaked'
export * from './FilecoinNaked'
export * from './FuseNaked'
export * from './GnosisNaked'
export * from './HaqqNaked'
export * from './HarmonyNaked'
export * from './HecoNaked'
export * from './HemiNaked'
export * from './HyperEVMNaked'
export * from './KatanaNaked'
export * from './KavaNaked'
export * from './LineaNaked'
export * from './MantaNaked'
export * from './MantleNaked'
export * from './MegaETHNaked'
export * from './MetisNaked'
export * from './ModeNaked'
export * from './MonadNaked'
export * from './MoonbeamNaked'
export * from './MoonriverNaked'
export * from './OkexNaked'
export * from './OptimismNaked'
export * from './PalmNaked'
export * from './PlasmaNaked'
export * from './PolygonNaked'
export * from './PolygonZKNaked'
export * from './RootstockNaked'
export * from './ScrollNaked'
export * from './SkaleNaked'
export * from './SolanaNaked'
export * from './SonicNaked'
export * from './TaikoNaked'
export * from './TelosNaked'
export * from './XLayerNaked'
export * from './ZKLinkNaked'
export * from './ZKSyncNaked'
export * from './ZetaChainNaked'

export const NETWORK_NAKED_ICON: Partial<
  Record<ChainId | string, IconComponent>
> = {
  [ChainId.ETHEREUM]: EthereumNaked,
  [ChainId.FANTOM]: FantomNaked,
  [ChainId.POLYGON]: PolygonNaked,
  [ChainId.GNOSIS]: GnosisNaked,
  [ChainId.BSC]: BinanceNaked,
  [ChainId.ARBITRUM]: ArbitrumNaked,
  [ChainId.AVALANCHE]: AvalancheNaked,
  [ChainId.HARMONY]: HarmonyNaked,
  [ChainId.CELO]: CeloNaked,
  [ChainId.OPTIMISM]: OptimismNaked,
  [ChainId.KAVA]: KavaNaked,
  [ChainId.METIS]: MetisNaked,
  [ChainId.ARBITRUM_NOVA]: ArbitrumNovaNaked,
  [ChainId.BOBA]: BobaNaked,
  [ChainId.BOBA_BNB]: BobaBNBNaked,
  [ChainId.BTTC]: BttcNaked,
  [ChainId.POLYGON_ZKEVM]: PolygonZKNaked,
  [ChainId.THUNDERCORE]: ThunderCoreNaked,
  [ChainId.HAQQ]: HaqqNaked,
  [ChainId.CORE]: CoreNaked,
  [ChainId.ZKSYNC_ERA]: ZKSyncNaked,
  [ChainId.LINEA]: LineaNaked,
  [ChainId.BASE]: BaseNaked,
  [ChainId.SCROLL]: ScrollNaked,
  [ChainId.FILECOIN]: FilecoinNaked,
  [ChainId.ZETACHAIN]: ZetaChainNaked,
  [ChainId.BLAST]: BlastNaked,
  [ChainId.SKALE_EUROPA]: SkaleNaked,
  [ChainId.ROOTSTOCK]: RootstockNaked,
  [ChainId.CRONOS]: CronosNaked,
  [ChainId.MANTLE]: MantleNaked,
  [ChainId.MANTA]: MantaNaked,
  [ChainId.MODE]: ModeNaked,
  [ChainId.TAIKO]: TaikoNaked,
  [ChainId.ZKLINK]: ZKLinkNaked,
  [ChainId.APE]: ApeNaked,
  [ChainId.SONIC]: SonicNaked,
  [ChainId.HEMI]: HemiNaked,
  [ChainId.KATANA]: KatanaNaked,
  [ChainId.HYPEREVM]: HyperEVMNaked,
  [ChainId.BERACHAIN]: BeraNaked,
  [ChainId.PLASMA]: PlasmaNaked,
  [ChainId.MONAD]: MonadNaked,
  [ChainId.MEGAETH]: MegaETHNaked,
  [ChainId.XLAYER]: XLayerNaked,
  [ChainId.APTOS]: AptosNaked,
  [ChainId.SOLANA]: SolanaNaked,
}
